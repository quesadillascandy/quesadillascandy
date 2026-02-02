
import React from 'react';
import { Order, OrderStatus, UserRole } from '../../types';
import OrderStatusBadge from './OrderStatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { DescargarPDFButton } from '../reportes/DescargarPDFButton';

interface Props {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus, extra?: any) => void;
  onClose: () => void;
}

const OrderDetail: React.FC<Props> = ({ order, onUpdateStatus, onClose }) => {
  const { profile } = useAuth();

  const canUpdate = () => {
    if (profile?.role === UserRole.ADMIN) return true;
    if (profile?.role === UserRole.PROD_MANAGER) {
      return [OrderStatus.CONFIRMADO, OrderStatus.EN_PRODUCCION, OrderStatus.LISTO_ENTREGA].includes(order.status);
    }
    if (order.user_id === profile?.id && order.status === OrderStatus.PENDIENTE) return true;
    return false;
  };

  const getNextStatus = (): OrderStatus | null => {
    switch (order.status) {
      case OrderStatus.PENDIENTE: return OrderStatus.CONFIRMADO;
      case OrderStatus.CONFIRMADO: return OrderStatus.EN_PRODUCCION;
      case OrderStatus.EN_PRODUCCION: return OrderStatus.LISTO_ENTREGA;
      case OrderStatus.LISTO_ENTREGA: return OrderStatus.EN_RUTA;
      case OrderStatus.EN_RUTA: return OrderStatus.ENTREGADO;
      case OrderStatus.ENTREGADO: return OrderStatus.COBRADO;
      default: return null;
    }
  };

  const next = getNextStatus();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        <header className="bg-primary p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">PEDIDO #{order.id.toUpperCase()}</h2>
            <p className="text-white/70 text-sm">Registrado el {new Date(order.created_at).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-3xl hover:rotate-90 transition-transform">×</button>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Estado Actual</h3>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-gray-500">Actualizado: {new Date(order.updated_at).toLocaleTimeString()}</span>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Detalle del Cliente</h3>
              <p className="font-bold text-lg">{order.user_name}</p>
              <p className="text-sm text-primary uppercase font-bold">{order.user_role}</p>
            </section>

            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Notas</h3>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic">
                {order.notes || "Sin observaciones adicionales"}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Productos</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                    <span><span className="font-bold">{item.quantity}x</span> {item.product_name}</span>
                    <span className="font-bold">${item.total.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 text-xl font-black text-secondary">
                  <span>TOTAL</span>
                  <span>${order.total.toLocaleString()}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Descargar</h3>
              <DescargarPDFButton pedido={order} variant="secondary" className="w-full" />
            </section>

            {canUpdate() && next && (
              <section className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                <h3 className="text-xs font-black text-secondary uppercase mb-3 tracking-widest">Acción de Flujo</h3>
                <button
                  onClick={() => onUpdateStatus(order.id, next)}
                  className="w-full bg-secondary text-white py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-all"
                >
                  Pasar a {next.replace('_', ' ')}
                </button>
                {order.status === OrderStatus.PENDIENTE && (
                  <button
                    onClick={() => onUpdateStatus(order.id, OrderStatus.CANCELADO)}
                    className="w-full mt-2 text-error font-bold text-sm py-2"
                  >
                    Cancelar Pedido
                  </button>
                )}
              </section>
            )}
          </div>
        </div>

        <footer className="p-4 bg-gray-50 border-t text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Panadería Pro - Realtime Order Management System
        </footer>
      </div>
    </div>
  );
};

export default OrderDetail;
