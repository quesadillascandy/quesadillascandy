
import React, { useState } from 'react';
import { Recipe } from '../../types';
import { useRecipes } from '../../hooks/useRecipes';

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

const ProductionSimulator: React.FC<Props> = ({ recipe, onClose }) => {
  const [qty, setQty] = useState(recipe.yield); // Default to 1 yield
  const { simulateProduction } = useRecipes();
  
  const simulation = simulateProduction(recipe.id, qty);

  if (!simulation) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-slideUp overflow-hidden">
        <header className="bg-gray-800 p-6 text-white flex justify-between items-center">
          <div>
             <h2 className="text-xl font-black uppercase tracking-widest">Simulador de Producción</h2>
             <p className="text-white/60 text-sm">Verificar stock para {recipe.name}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300">Cerrar</button>
        </header>

        <div className="p-8">
           <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-200">
             <div className="flex-1">
               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cantidad a Producir</label>
               <div className="flex items-center gap-4">
                 <input 
                   type="number" 
                   value={qty}
                   onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                   className="text-4xl font-black w-32 bg-transparent outline-none text-primary border-b-2 border-primary/20 focus:border-primary"
                 />
                 <span className="text-gray-400 font-bold text-sm">unidades</span>
               </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Costo Estimado Total</p>
                <p className="text-3xl font-black text-gray-800">${simulation.estimatedTotalCost.toFixed(2)}</p>
             </div>
           </div>

           <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
             <span>📦</span> Disponibilidad de Materia Prima
           </h3>
           
           <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
             {simulation.requirements.map(req => (
               <div key={req.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white">
                 <div className="flex-1">
                   <p className="font-bold text-gray-700 text-sm">{req.name}</p>
                   <p className="text-xs text-gray-400">Req: {req.required.toFixed(2)} {req.unit} • Stock: {req.stock.toFixed(2)} {req.unit}</p>
                 </div>
                 <div className="text-right">
                   {req.status === 'OK' ? (
                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Disponible</span>
                   ) : (
                     <div className="flex flex-col items-end">
                       <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase mb-1">Falta Stock</span>
                       <span className="text-xs font-bold text-red-500">Faltan {req.missing.toFixed(2)} {req.unit}</span>
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>

           <div className="mt-8 pt-6 border-t">
             {simulation.canProduce ? (
               <button className="w-full bg-success text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform">
                 ✅ Confirmar Producción (Descontar Inventario)
               </button>
             ) : (
               <button className="w-full bg-warning text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:brightness-105 transition-transform flex items-center justify-center gap-2">
                 <span>🛒</span> Generar Lista de Compra de Faltantes
               </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionSimulator;
