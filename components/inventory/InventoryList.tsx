
import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import KardexModal from './KardexModal';

interface Props {
  onSelectItem: (item: any) => void;
  onOpenMovement: (item: any) => void;
}

const InventoryList: React.FC<Props> = ({ onSelectItem, onOpenMovement }) => {
  const { items, loading } = useInventory();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [showKardexItem, setShowKardexItem] = useState<any>(null);

  const filtered = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || i.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  if (loading) return <div className="p-12 text-center animate-pulse">Cargando inventario...</div>;

  return (
    <div className="space-y-6">
      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative w-full md:w-96">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar ítem..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'MATERIA_PRIMA', 'INSUMO'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {t === 'ALL' ? 'Todos' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4 w-8"></th>
              <th className="px-6 py-4">Ítem / Categoría</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Costo Prom.</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(item => {
              const status = item.stock_current <= item.stock_min * 0.5 
                ? 'CRÍTICO' 
                : item.stock_current <= item.stock_min 
                ? 'BAJO' 
                : 'NORMAL';
              
              const statusColor = status === 'CRÍTICO' ? 'text-error' : status === 'BAJO' ? 'text-warning' : 'text-success';
              const hasBatches = item.batches && item.batches.length > 0;

              return (
                <React.Fragment key={item.id}>
                  <tr className={`hover:bg-gray-50/50 transition-colors ${expandedItemId === item.id ? 'bg-gray-50' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      {hasBatches && (
                        <button onClick={() => toggleExpand(item.id)} className="text-gray-400 hover:text-primary transition-colors">
                          {expandedItemId === item.id ? '▼' : '▶'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-tighter">{item.type.replace('_', ' ')}</span>
                        {item.category === 'PERECEDERO' && <span className="text-[9px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase tracking-tighter">Perecedero</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-black">{item.stock_current}</span>
                      <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                      <p className="text-[10px] text-gray-400">Min: {item.stock_min}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'CRÍTICO' ? 'bg-error' : status === 'BAJO' ? 'bg-warning' : 'bg-success'}`}></div>
                        <span className={`text-[10px] font-black uppercase ${statusColor}`}>{status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-secondary">
                      ${item.cost_avg.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onOpenMovement(item)}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          + Movimiento
                        </button>
                        <button 
                          onClick={() => setShowKardexItem(item)}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          📜 Kardex
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Vista Expandida de Lotes */}
                  {expandedItemId === item.id && hasBatches && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-4 pl-12">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <table className="w-full text-xs">
                            <thead className="bg-gray-100 text-gray-500 font-bold uppercase">
                              <tr>
                                <th className="px-4 py-2">Lote ID</th>
                                <th className="px-4 py-2">Stock Lote</th>
                                <th className="px-4 py-2">Vencimiento</th>
                                <th className="px-4 py-2 text-right">Días Restantes</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {item.batches?.filter(b => b.quantity_current > 0).map(batch => {
                                const days = Math.ceil((new Date(batch.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                return (
                                  <tr key={batch.id}>
                                    <td className="px-4 py-2 font-mono">{batch.batch_number}</td>
                                    <td className="px-4 py-2 font-bold">{batch.quantity_current} {item.unit}</td>
                                    <td className="px-4 py-2">{batch.expiry_date}</td>
                                    <td className={`px-4 py-2 text-right font-bold ${days < 0 ? 'text-error' : days < 7 ? 'text-warning' : 'text-success'}`}>
                                      {days} días
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {showKardexItem && (
        <KardexModal item={showKardexItem} onClose={() => setShowKardexItem(null)} />
      )}
    </div>
  );
};

export default InventoryList;
