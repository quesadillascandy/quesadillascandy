
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Recipe, RecipeIngredient, RecipeCost } from '../types';
import { useInventory } from './useInventory';

export const useRecipes = () => {
  const { items: inventoryItems } = useInventory();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('recetas')
        .select(`
          *,
          ingredientes_receta (
            id,
            id_item_inventario,
            cantidad,
            unidad,
            porcentaje_merma,
            items_inventario (
              nombre
            )
          ),
          costos_receta (
            id,
            concepto,
            monto,
            es_por_unidad
          )
        `)
        .eq('activa', true)
        .order('nombre', { ascending: true });

      if (error) {
        console.error('Error cargando recetas:', error);
        setLoading(false);
        return;
      }

      // Transformar datos
      const transformedRecipes: Recipe[] = (data || []).map((receta: any) => ({
        id: receta.id,
        product_id: receta.id_producto,
        name: receta.nombre,
        version: receta.version,
        yield: parseFloat(receta.rendimiento),
        prep_time_minutes: receta.tiempo_preparacion_minutos,
        instructions: receta.instrucciones,
        is_active: receta.activa,
        last_updated: receta.updated_at,
        ingredients: (receta.ingredientes_receta || []).map((ing: any) => ({
          id: ing.id,
          recipe_id: receta.id,
          inventory_item_id: ing.id_item_inventario,
          inventory_item_name: ing.items_inventario?.nombre || 'Desconocido',
          quantity: parseFloat(ing.cantidad),
          unit: ing.unidad,
          waste_pct: parseFloat(ing.porcentaje_merma),
        })),
        costs: (receta.costos_receta || []).map((cost: any) => ({
          id: cost.id,
          recipe_id: receta.id,
          concept: cost.concepto,
          amount: parseFloat(cost.monto),
          is_per_unit: cost.es_por_unidad,
        })),
      }));

      setRecipes(transformedRecipes);
      setLoading(false);
    } catch (err) {
      console.error('Error inesperado cargando recetas:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();

    // Suscripción realtime
    const subscription = supabase
      .channel('recipes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recetas' },
        () => loadRecipes()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadRecipes]);

  // CALCULO DE COSTOS
  const calculateRecipeCost = (recipe: Recipe) => {
    // 1. Costo de Materiales (Directo)
    let materialCost = 0;
    const materialDetails: any[] = [];

    recipe.ingredients.forEach((ing) => {
      // Buscar el item en el inventario actual para obtener el precio al día
      const invItem = inventoryItems.find((i) => i.id === ing.inventory_item_id);
      const unitCost = invItem ? invItem.cost_avg : 0;

      // Costo = Cantidad * CostoUnitario * (1 + Merma)
      const wasteMultiplier = 1 + ing.waste_pct / 100;
      const totalIngCost = ing.quantity * unitCost * wasteMultiplier;

      materialCost += totalIngCost;
      materialDetails.push({
        name: ing.inventory_item_name,
        quantity: ing.quantity,
        unit: ing.unit,
        unitCost,
        totalCost: totalIngCost,
        wasteCost: totalIngCost - ing.quantity * unitCost,
      });
    });

    // 2. Costos Indirectos (Fixed)
    let fixedCost = 0;
    recipe.costs.forEach((cost) => {
      // Si es por unidad, se suma directo. Si es por lote, se divide entre el yield.
      const amount = cost.is_per_unit ? cost.amount : cost.amount / recipe.yield;
      fixedCost += amount;
    });

    const totalCost = (materialCost + fixedCost) / recipe.yield; // Costo unitario final

    return {
      totalUnitCost: totalCost,
      materialCostPerUnit: materialCost / recipe.yield,
      fixedCostPerUnit: fixedCost / recipe.yield,
      details: materialDetails,
    };
  };

  // SIMULADOR DE PRODUCCION
  const simulateProduction = (recipeId: string, quantity: number) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return null;

    const requirements = recipe.ingredients.map((ing) => {
      const invItem = inventoryItems.find((i) => i.id === ing.inventory_item_id);
      // Cantidad necesaria = (Cantidad en receta / Rendimiento receta) * Cantidad deseada
      const wasteMultiplier = 1 + ing.waste_pct / 100;
      const requiredQty = ((ing.quantity * wasteMultiplier) / recipe.yield) * quantity;
      const currentStock = invItem ? invItem.stock_current : 0;
      const missing = Math.max(0, requiredQty - currentStock);

      return {
        id: ing.inventory_item_id,
        name: ing.inventory_item_name,
        unit: ing.unit,
        required: requiredQty,
        stock: currentStock,
        missing: missing,
        status: missing > 0 ? 'LACKING' : 'OK',
      };
    });

    const costs = calculateRecipeCost(recipe);
    const estimatedTotalCost = costs.totalUnitCost * quantity;

    return {
      requirements,
      estimatedTotalCost,
      canProduce: requirements.every((r) => r.status === 'OK'),
    };
  };

  // CALCULO DE NECESIDADES (Desde Pedidos)
  const calculateNeedsFromOrders = (orders: any[]) => {
    const consolidatedNeeds: Record<string, any> = {};

    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const productRecipe = recipes.find((r) => r.product_id === item.product_id);
        if (productRecipe) {
          productRecipe.ingredients.forEach((ing) => {
            const wasteMultiplier = 1 + ing.waste_pct / 100;
            const required = ((ing.quantity * wasteMultiplier) / productRecipe.yield) * item.quantity;

            if (!consolidatedNeeds[ing.inventory_item_id]) {
              consolidatedNeeds[ing.inventory_item_id] = {
                id: ing.inventory_item_id,
                name: ing.inventory_item_name,
                unit: ing.unit,
                totalRequired: 0,
              };
            }
            consolidatedNeeds[ing.inventory_item_id].totalRequired += required;
          });
        }
      });
    });

    // Comparar con stock
    return Object.values(consolidatedNeeds).map((need: any) => {
      const invItem = inventoryItems.find((i) => i.id === need.id);
      const stock = invItem ? invItem.stock_current : 0;
      return {
        ...need,
        stock,
        missing: Math.max(0, need.totalRequired - stock),
        status: stock >= need.totalRequired ? 'OK' : 'MISSING',
      };
    });
  };

  return {
    recipes,
    loading,
    calculateRecipeCost,
    simulateProduction,
    calculateNeedsFromOrders,
    refresh: loadRecipes,
  };
};
