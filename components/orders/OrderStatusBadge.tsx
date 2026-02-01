
import React from 'react';
import { OrderStatus } from '../../types';
import { STATUS_COLORS } from '../../constants';

interface Props {
  status: OrderStatus;
}

const OrderStatusBadge: React.FC<Props> = ({ status }) => {
  const color = STATUS_COLORS[status] || '#CBD5E1';
  
  return (
    <span 
      className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {status.replace('_', ' ')}
    </span>
  );
};

export default OrderStatusBadge;
