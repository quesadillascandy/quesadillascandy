
import React from 'react';
import { InventoryItem, MovementType } from '../../types';
import { useInventory } from '../../hooks/useInventory';

interface Props {
  item: InventoryItem;
  onClose: () => void;
}

const KardexModal: React.FC<Props> = ({ item, onClose }) => {
  const { getKardex } = useInventory();
  const movements = getKardex(item.id);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-scaleIn h-[80vh] flex flex-col">
        <header className="bg-gray-800 p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest">Kardex de Producto</h2>
            <p className="text-white/70 text-sm">{item.name} ({item.unit})</p>
          </div>
          <button onClick={onClose} className="text-2xl hover:text-orange-400 transition-colors">×</button>
        </header>

        <div className="p-6 bg-gray-50 border-b shrink-0 grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-xl border shadow-sm">
             <p className="text-[10px] uppercase text-gray-400 font-bold">Stock Actual</p>
             <p className="text-xl font-black text-gray-800">{item.stock_current} <span className="text-sm text-gray-400">{item.unit}</span></p>
          </div>
          <div className="bg-white p-3 rounded-xl border shadow-sm">
             <p className="text-[10px] uppercase text-gray-400 font-bold">Costo Promedio</p>
             <p className="text-xl font-black text-secondary">${item.cost_avg.toFixed(2)}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border shadow-sm">
             <p className="text-[10px] uppercase text-gray-400 font-bold">Valor Total</p>
             <p className="text-xl font-black text-primary">${(item.stock_current * item.cost_avg).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-3 border-b">Fecha</th>
                <th className="px-6 py-3 border-b">Movimiento</th>
                <th className="px-6 py-3 border-b">Detalle</th>
                <th className="px-6 py-3 border-b text-center">Entrada</th>
                <th className="px-6 py-3 border-b text-center">Salida</th>
                <th className="px-6 py-3 border-b text-center">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.length === 0 ? (
                 <tr><td colSpan={6} className="p-8 text-center text-gray-400 italic">Sin movimientos registrados</td></tr>
              ) : (
                movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-blue-50/50 transition-colors text-xs">
                    <td className="px-6 py-3 font-medium text-gray-600">
                      {new Date(mov.created_at).toLocaleDateString()}
                      <div className="text-[9px] text-gray-400">{new Date(mov.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-md font-bold uppercase text-[9px] ${
                        mov.type === MovementType.IN ? 'bg-success/10 text-success' :
                        mov.type === MovementType.OUT ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                      }`}>
                        {mov.type}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                       <p className="font-bold text-gray-700">{mov.reason}</p>
                       <p className="text-[9px] text-gray-400">Usuario: {mov.user_name}</p>
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-success">
                      {mov.type === MovementType.IN ? `+${mov.quantity}` : '-'}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-error">
                      {mov.type === MovementType.OUT ? `-${mov.quantity}` : '-'}
                    </td>
                    <td className="px-6 py-3 text-center font-black bg-gray-50">
                      {mov.stock_after}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KardexModal;
