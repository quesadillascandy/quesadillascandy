
import React from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { Recipe } from '../../types';

interface Props {
  onSelect: (recipe: Recipe) => void;
}

const RecipeList: React.FC<Props> = ({ onSelect }) => {
  const { recipes, calculateRecipeCost, loading } = useRecipes();

  if (loading) return <div className="p-12 text-center animate-pulse">Cargando recetas...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => {
        const costs = calculateRecipeCost(recipe);
        const ingredientCount = recipe.ingredients.length;
        
        return (
          <div 
            key={recipe.id}
            onClick={() => onSelect(recipe)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group"
          >
            <div className="h-2 bg-primary group-hover:bg-secondary transition-colors"></div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-gray-800 text-lg leading-tight">{recipe.name}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1">Ver. {recipe.version} • {recipe.yield} unidad(es)</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-2xl">📝</div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50">
                <div>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Costo Unitario</p>
                   <p className="text-2xl font-black text-secondary">${costs.totalUnitCost.toFixed(2)}</p>
                </div>
                <div>
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tiempo Prep.</p>
                   <p className="text-lg font-bold text-gray-700">{recipe.prep_time_minutes} min</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{ingredientCount} Ingredientes</span>
                <span className="flex items-center gap-1 text-primary font-bold">
                  Ver Detalle <span>→</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Add New Recipe Card */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer min-h-[250px]">
        <span className="text-4xl mb-2">+</span>
        <span className="font-bold uppercase tracking-widest text-sm">Crear Nueva Receta</span>
      </div>
    </div>
  );
};

export default RecipeList;
