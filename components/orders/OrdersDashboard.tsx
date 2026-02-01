
import React from 'react';
import { useOrders } from '../../hooks/useOrders';
import { OrderStatus } from '../../types';

const OrdersDashboard: React.FC = () => {
  const { orders } = useOrders();
  
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.created_at.startsWith(today));
  
  const stats = {
    total: todayOrders.length,
    revenue: todayOrders.reduce((sum, o) => o.status !== OrderStatus.CANCELADO ? sum + o.total : sum, 0),
    pending: orders.filter(o => o.status === OrderStatus.PENDIENTE).length,
    production: orders.filter(o => o.status === OrderStatus.EN_PRODUCCION).length,
    ready: orders.filter(o => o.status === OrderStatus.LISTO_ENTREGA).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ventas Hoy</p>
        <p className="text-xl font-black text-success">${stats.revenue.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Pendientes</p>
        <p className="text-xl font-black text-warning">{stats.pending}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">En Cocina</p>
        <p className="text-xl font-black text-secondary">{stats.production}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Por Entregar</p>
        <p className="text-xl font-black text-primary">{stats.ready}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm col-span-2 md:col-span-1">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Pedidos</p>
        <p className="text-xl font-black">{stats.total}</p>
      </div>
    </div>
  );
};

export default OrdersDashboard;
