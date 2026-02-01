
import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { OrderStatus, UserRole } from '../../types';
import OrderStatusBadge from './OrderStatusBadge';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  onSelect: (order: any) => void;
}

const OrderList: React.FC<Props> = ({ onSelect }) => {
  const { orders, loading } = useOrders();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) return <div className="p-12 text-center animate-pulse">Cargando pedidos...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', ...Object.values(OrderStatus)].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === s ? 'bg-primary text-white' : 'bg-white border text-gray-400 hover:border-primary'
            }`}
          >
            {s === 'ALL' ? 'Todos' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border-2 border-dashed">
            <p className="text-gray-400">No se encontraron pedidos en esta categoría</p>
          </div>
        ) : (
          filtered.map(order => (
            <div 
              key={order.id}
              onClick={() => onSelect(order)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl group-hover:bg-primary/10 transition-colors">
                  🛒
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-800">#{order.id.toUpperCase()}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.user_name} • {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-primary">${order.total.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Entrega: {order.delivery_date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
