
import React from 'react';
import { useInventory } from '../../hooks/useInventory';

const InventoryDashboard: React.FC = () => {
  const { items, alerts, movements } = useInventory();
  
  // Cálculo de Valoración (Stock * Costo Promedio Ponderado)
  const totalValue = items.reduce((sum, i) => sum + (i.stock_current * i.cost_avg), 0);
  
  const lowStockCount = items.filter(i => i.stock_current <= i.stock_min).length;
  const criticalCount = items.filter(i => i.stock_current <= i.stock_min * 0.5).length;
  const expiredCount = alerts.filter(a => a.type === 'EXPIRED').length;
  const expiryWarningCount = alerts.filter(a => a.type === 'EXPIRY_WARNING').length;

  return (
    <div className="space-y-6 mb-8 animate-fadeIn">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">💰</div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Valor en Bodega</p>
            <p className="text-xl font-black text-primary">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className={`bg-white p-5 rounded-2xl shadow-sm border flex items-center gap-4 ${criticalCount > 0 ? 'border-error/20 bg-error/5' : 'border-gray-100'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${criticalCount > 0 ? 'bg-error/10' : 'bg-gray-100'}`}>⚠️</div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Stock Crítico</p>
            <p className={`text-xl font-black ${criticalCount > 0 ? 'text-error' : 'text-gray-800'}`}>{criticalCount} <span className="text-xs font-medium text-gray-400">ítems</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-2xl">📅</div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Por Vencer (7 días)</p>
            <p className="text-xl font-black text-warning">{expiryWarningCount} <span className="text-xs font-medium text-gray-400">lotes</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">☠️</div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Vencidos</p>
            <p className="text-xl font-black text-error">{expiredCount} <span className="text-xs font-medium text-gray-400">lotes</span></p>
          </div>
        </div>
      </div>

      {/* Sugerencia de Reabastecimiento Rápido */}
      {lowStockCount > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-white p-4 rounded-xl border border-orange-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛒</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">Necesidad de Compra Detectada</p>
              <p className="text-xs text-gray-500">Hay {lowStockCount} productos por debajo del mínimo requerido.</p>
            </div>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:scale-105 transition-transform">
            Generar Lista de Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
