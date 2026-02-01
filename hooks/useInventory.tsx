
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import {
  InventoryItem,
  InventoryMovement,
  InventoryAlert,
  MovementType,
  InventoryBatch,
  InventoryItemType
} from '../types';
import { useAuth } from './useAuth';

export const useInventory = () => {
  const { profile, user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!profile || !user) {
      setItems([]);
      setMovements([]);
      setAlerts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Cargar items de inventario con sus lotes
      const { data: itemsData, error: itemsError } = await supabase
        .from('items_inventario')
        .select(`
          *,
          lotes_inventario (*)
        `)
        .order('nombre', { ascending: true });

      if (itemsError) {
        console.error('Error cargando inventario:', itemsError);
        setLoading(false);
        return;
      }

      // 2. Cargar movimientos
      const { data: movementsData, error: movementsError } = await supabase
        .from('movimientos_inventario')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Limitar a últimos 100 movimientos

      if (movementsError) {
        console.error('Error cargando movimientos:', movementsError);
      }

      // 3. Transformar datos
      const transformedItems: InventoryItem[] = (itemsData || []).map((item: any) => ({
        id: item.id,
        name: item.nombre,
        type: item.tipo as InventoryItemType,
        category: item.categoria,
        unit: item.unidad,
        stock_current: parseFloat(item.stock_actual),
        stock_min: parseFloat(item.stock_minimo),
        stock_max: parseFloat(item.stock_maximo),
        cost_avg: parseFloat(item.costo_promedio),
        last_price: parseFloat(item.ultimo_precio),
        location: item.ubicacion,
        batches: (item.lotes_inventario || []).map((lote: any) => ({
          id: lote.id,
          item_id: lote.id_item,
          batch_number: lote.numero_lote,
          quantity_initial: parseFloat(lote.cantidad_inicial),
          quantity_current: parseFloat(lote.cantidad_actual),
          expiry_date: lote.fecha_vencimiento,
          cost_unit: parseFloat(lote.costo_unitario),
          created_at: lote.created_at,
        })),
      }));

      const transformedMovements: InventoryMovement[] = (movementsData || []).map((mov: any) => ({
        id: mov.id,
        item_id: mov.id_item,
        type: mov.tipo as MovementType,
        quantity: parseFloat(mov.cantidad),
        unit_price: mov.precio_unitario ? parseFloat(mov.precio_unitario) : undefined,
        total_cost: mov.costo_total ? parseFloat(mov.costo_total) : undefined,
        reason: mov.razon,
        user_id: mov.id_usuario,
        user_name: mov.nombre_usuario,
        batch_id: mov.id_lote,
        stock_after: parseFloat(mov.stock_despues),
        created_at: mov.created_at,
      }));

      setItems(transformedItems);
      setMovements(transformedMovements);

      // 4. Generar alertas
      generateAlerts(transformedItems);

      setLoading(false);
    } catch (err) {
      console.error('Error inesperado cargando inventario:', err);
      setLoading(false);
    }
  }, [profile, user]);

  const generateAlerts = (itemsList: InventoryItem[]) => {
    const newAlerts: InventoryAlert[] = [];
    const today = new Date();

    itemsList.forEach((item) => {
      // Alertas de stock
      if (item.stock_current <= item.stock_min * 0.5) {
        newAlerts.push({
          id: `alert-crit-${item.id}`,
          item_id: item.id,
          item_name: item.name,
          type: 'CRITICAL_STOCK',
          message: `Stock CRÍTICO: ${item.stock_current} ${item.unit} (Mín: ${item.stock_min})`,
          severity: 'error',
          created_at: new Date().toISOString(),
        });
      } else if (item.stock_current <= item.stock_min) {
        newAlerts.push({
          id: `alert-low-${item.id}`,
          item_id: item.id,
          item_name: item.name,
          type: 'LOW_STOCK',
          message: `Stock Bajo: ${item.stock_current} ${item.unit}. Reordenar pronto.`,
          severity: 'warning',
          created_at: new Date().toISOString(),
        });
      }

      // Alertas de vencimiento
      if (item.batches && item.batches.length > 0) {
        item.batches.forEach((batch) => {
          if (batch.quantity_current > 0) {
            const expiry = new Date(batch.expiry_date);
            const diffTime = expiry.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
              newAlerts.push({
                id: `alert-exp-${batch.id}`,
                item_id: item.id,
                item_name: item.name,
                type: 'EXPIRED',
                message: `LOTE VENCIDO: ${batch.batch_number} (${batch.quantity_current} ${item.unit}). ¡Descartar!`,
                severity: 'error',
                created_at: new Date().toISOString(),
                days_remaining: diffDays,
              });
            } else if (diffDays <= 7) {
              newAlerts.push({
                id: `alert-warn-${batch.id}`,
                item_id: item.id,
                item_name: item.name,
                type: 'EXPIRY_WARNING',
                message: `Vence pronto: Lote ${batch.batch_number} en ${diffDays} días.`,
                severity: 'warning',
                created_at: new Date().toISOString(),
                days_remaining: diffDays,
              });
            }
          }
        });
      }
    });

    setAlerts(newAlerts);
  };

  useEffect(() => {
    loadData();

    // Suscripción realtime a cambios en inventario
    const subscription = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items_inventario' },
        () => loadData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movimientos_inventario' },
        () => loadData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadData]);

  const registerMovement = async (data: {
    item_id: string;
    type: MovementType;
    quantity: number;
    unit_price?: number;
    reason: string;
    expiry_date?: string;
    batch_number?: string;
  }) => {
    if (!profile || !user) {
      alert('Debes estar autenticado');
      return;
    }

    try {
      // 1. Obtener item actual
      const { data: itemData, error: itemError } = await supabase
        .from('items_inventario')
        .select('*, lotes_inventario(*)')
        .eq('id', data.item_id)
        .single();

      if (itemError || !itemData) {
        alert('Error: Item no encontrado');
        return;
      }

      const currentStock = parseFloat(itemData.stock_actual);
      const currentCostAvg = parseFloat(itemData.costo_promedio);
      const lastPrice = parseFloat(itemData.ultimo_precio);
      const qty = data.quantity;
      let newStock = currentStock;
      let newCostAvg = currentCostAvg;
      let newLastPrice = lastPrice;
      let batchId = null;

      // 2. Lógica según tipo de movimiento
      if (data.type === MovementType.IN) {
        // ENTRADA
        const price = data.unit_price || lastPrice;

        // Costo promedio ponderado
        const currentTotalValue = currentStock * currentCostAvg;
        const newEntryValue = qty * price;
        newStock = currentStock + qty;
        newCostAvg = newStock > 0 ? (currentTotalValue + newEntryValue) / newStock : price;
        newLastPrice = price;

        // Crear lote si es necesario
        if (data.expiry_date || itemData.categoria === 'PERECEDERO') {
          const { data: loteData, error: loteError } = await supabase
            .from('lotes_inventario')
            .insert({
              id_item: data.item_id,
              numero_lote: data.batch_number || `L-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
              cantidad_inicial: qty,
              cantidad_actual: qty,
              fecha_vencimiento: data.expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              costo_unitario: price,
            })
            .select()
            .single();

          if (!loteError && loteData) {
            batchId = loteData.id;
          }
        }
      } else if (data.type === MovementType.OUT) {
        // SALIDA
        if (currentStock < qty) {
          alert(`Stock insuficiente. Disponible: ${currentStock} ${itemData.unidad}`);
          return;
        }

        newStock = currentStock - qty;

        // Descontar de lotes (FIFO)
        if (itemData.lotes_inventario && itemData.lotes_inventario.length > 0) {
          let remainingToDeduct = qty;
          const lotes = [...itemData.lotes_inventario].sort(
            (a: any, b: any) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime()
          );

          for (const lote of lotes) {
            if (remainingToDeduct <= 0) break;
            if (parseFloat(lote.cantidad_actual) > 0) {
              const deduct = Math.min(parseFloat(lote.cantidad_actual), remainingToDeduct);
              const newLoteQty = parseFloat(lote.cantidad_actual) - deduct;

              await supabase
                .from('lotes_inventario')
                .update({ cantidad_actual: newLoteQty })
                .eq('id', lote.id);

              remainingToDeduct -= deduct;
            }
          }
        }
      } else {
        // AJUSTE
        newStock = qty;
      }

      // 3. Actualizar item de inventario
      const { error: updateError } = await supabase
        .from('items_inventario')
        .update({
          stock_actual: newStock,
          costo_promedio: newCostAvg,
          ultimo_precio: newLastPrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.item_id);

      if (updateError) {
        console.error('Error actualizando item:', updateError);
        alert(`Error: ${updateError.message}`);
        return;
      }

      // 4. Registrar movimiento
      const { error: movError } = await supabase
        .from('movimientos_inventario')
        .insert({
          id_item: data.item_id,
          tipo: data.type,
          cantidad: qty,
          precio_unitario: data.type === MovementType.IN ? data.unit_price : currentCostAvg,
          costo_total: qty * (data.type === MovementType.IN ? (data.unit_price || 0) : currentCostAvg),
          razon: data.reason,
          id_usuario: user.id,
          nombre_usuario: profile.full_name,
          id_lote: batchId,
          stock_despues: newStock,
        });

      if (movError) {
        console.error('Error registrando movimiento:', movError);
        alert(`Error: ${movError.message}`);
        return;
      }

      console.log(`✅ Movimiento registrado: ${data.type} de ${qty} unidades`);
      await loadData();
    } catch (err) {
      console.error('Error inesperado:', err);
      alert('Error al registrar movimiento');
    }
  };

  const getKardex = (itemId: string) => {
    return movements.filter((m) => m.item_id === itemId);
  };

  return { items, movements, alerts, loading, registerMovement, refresh: loadData, getKardex };
};
