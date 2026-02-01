
import React from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { useOrders } from '../../hooks/useOrders';
import { OrderStatus } from '../../types';

const NeedsCalculator: React.FC = () => {
  const { orders } = useOrders();
  const { calculateNeedsFromOrders } = useRecipes();

  // Filtrar pedidos que no han sido entregados ni cancelados
  const activeOrders = orders.filter(o => 
    o.status === OrderStatus.PENDIENTE || 
    o.status === OrderStatus.CONFIRMADO || 
    o.status === OrderStatus.EN_PRODUCCION
  );

  const needs = calculateNeedsFromOrders(activeOrders);
  const totalMissingItems = needs.filter(n => n.status === 'MISSING').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
      <header className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Explosión de Materiales</h3>
          <p className="text-sm text-gray-500">Basado en {activeOrders.length} pedidos activos</p>
        </div>
        {totalMissingItems > 0 && (
           <div className="bg-error/10 text-error px-4 py-2 rounded-xl text-xs font-black uppercase animate-pulse">
             ⚠️ {totalMissingItems} Insumos Insuficientes
           </div>
        )}
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <tr>
              <th className="px-4 py-3">Materia Prima</th>
              <th className="px-4 py-3 text-center">Necesidad Total</th>
              <th className="px-4 py-3 text-center">Stock Actual</th>
              <th className="px-4 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {needs.map((item, idx) => (
              <tr key={idx} className={item.status === 'MISSING' ? 'bg-red-50/50' : ''}>
                <td className="px-4 py-3 font-bold text-gray-700">{item.name}</td>
                <td className="px-4 py-3 text-center font-mono text-blue-600 font-bold">{item.totalRequired.toFixed(2)} {item.unit}</td>
                <td className="px-4 py-3 text-center font-mono text-gray-500">{item.stock.toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  {item.status === 'MISSING' ? (
                    <span className="text-error font-bold text-xs uppercase">Faltan {item.missing.toFixed(2)}</span>
                  ) : (
                    <span className="text-success font-bold text-xs uppercase">✓ Cubierto</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalMissingItems > 0 && (
        <div className="mt-4 flex justify-end">
          <button className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-transform">
            Generar Orden de Compra Automática
          </button>
        </div>
      )}
    </div>
  );
};

export default NeedsCalculator;
