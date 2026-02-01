
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Recipe, Product } from '../../types';
import { useRecipes } from '../../hooks/useRecipes';
import { INITIAL_PRODUCTS } from '../../constants';

interface Props {
  recipe: Recipe;
  onClose: () => void;
  onSimulate: () => void;
}

const RecipeDetail: React.FC<Props> = ({ recipe, onClose, onSimulate }) => {
  const { calculateRecipeCost } = useRecipes();
  const costs = calculateRecipeCost(recipe);
  
  // Vincular con producto para ver precio venta
  const product = INITIAL_PRODUCTS.find(p => p.id === recipe.product_id);
  const salePrice = product?.prices['minorista'] || 0;
  const margin = salePrice - costs.totalUnitCost;
  const marginPct = (margin / salePrice) * 100;

  const chartData = [
    { name: 'Materia Prima', value: costs.materialCostPerUnit, color: '#D97706' }, // Primary
    { name: 'Costos Fijos', value: costs.fixedCostPerUnit, color: '#78350F' }, // Secondary
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-scaleIn h-[90vh] flex flex-col">
        {/* Header */}
        <header className="bg-secondary p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black uppercase tracking-widest">{recipe.name}</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">v{recipe.version}</span>
            </div>
            <p className="text-white/70 text-sm mt-1">Rendimiento: {recipe.yield} unidades • {recipe.prep_time_minutes} min</p>
          </div>
          <div className="flex gap-4">
             <button onClick={onSimulate} className="bg-white text-secondary px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
               ⚡ Simular Producción
             </button>
             <button onClick={onClose} className="text-3xl hover:text-orange-300 transition-colors">×</button>
          </div>
        </header>

        <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-3">
          
          {/* Columna Izquierda: Ingredientes */}
          <div className="md:col-span-2 p-8 space-y-8 border-r overflow-y-auto">
            <section>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Lista de Ingredientes</h3>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Insumo</th>
                      <th className="px-4 py-3 text-center">Cant.</th>
                      <th className="px-4 py-3 text-center">Merma</th>
                      <th className="px-4 py-3 text-right">Costo Est.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {costs.details.map((ing: any, idx: number) => (
                      <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-700">{ing.name}</td>
                        <td className="px-4 py-3 text-center">{ing.quantity} {ing.unit}</td>
                        <td className="px-4 py-3 text-center text-gray-400">{recipe.ingredients[idx].waste_pct}%</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-gray-600">${ing.totalCost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Costos Indirectos y Fijos</h3>
               <div className="grid grid-cols-2 gap-4">
                 {recipe.costs.map((cost, idx) => (
                   <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-100">
                      <span className="font-bold text-gray-600 text-sm">{cost.concept}</span>
                      <span className="font-mono text-gray-500 text-sm">${cost.amount.toFixed(2)} {cost.is_per_unit ? '/ u' : '/ lote'}</span>
                   </div>
                 ))}
               </div>
            </section>

            {recipe.instructions && (
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Instrucciones de Preparación</h3>
                <div className="bg-orange-50 p-6 rounded-xl text-gray-700 italic border border-orange-100 leading-relaxed text-sm">
                  {recipe.instructions}
                </div>
              </section>
            )}
          </div>

          {/* Columna Derecha: Análisis Financiero */}
          <div className="bg-gray-50/50 p-8 space-y-8">
            <section>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Estructura de Costos</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
               <div className="flex justify-between items-end border-b pb-4">
                  <p className="text-xs text-gray-400 font-black uppercase">Costo Total Unitario</p>
                  <p className="text-3xl font-black text-secondary">${costs.totalUnitCost.toFixed(2)}</p>
               </div>
               
               <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Precio Venta (Minorista)</span>
                    <span className="font-bold">${salePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Margen Bruto</span>
                    <span className={`font-bold ${margin > 0 ? 'text-success' : 'text-error'}`}>${margin.toFixed(2)}</span>
                  </div>
               </div>

               <div className={`mt-4 p-3 rounded-xl text-center border-2 ${marginPct > 30 ? 'bg-green-50 border-green-200 text-green-700' : marginPct > 15 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1">Rentabilidad</p>
                 <p className="text-xl font-black">{marginPct.toFixed(1)}%</p>
                 <p className="text-xs font-medium mt-1">{marginPct > 30 ? 'Excelente Rendimiento 🚀' : 'Revisar Costos ⚠️'}</p>
               </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 text-xs">
              <span>✨</span> Optimizar con Gemini AI
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
