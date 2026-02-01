
import React from 'react';
import { useInventory } from '../../hooks/useInventory';

const AlertsWidget: React.FC = () => {
  const { alerts } = useInventory();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 space-y-2 z-40">
      {alerts.map(alert => (
        <div 
          key={alert.id}
          className={`p-4 rounded-xl shadow-2xl border-l-4 animate-slideIn flex items-start gap-3 ${
            alert.severity === 'error' ? 'bg-white border-error' : 'bg-white border-warning'
          }`}
        >
          <span className="text-xl">{alert.severity === 'error' ? '🚨' : '⚠️'}</span>
          <div>
            <p className={`text-xs font-black uppercase tracking-tighter ${alert.severity === 'error' ? 'text-error' : 'text-warning'}`}>
              {alert.type.replace('_', ' ')}
            </p>
            <p className="text-xs text-gray-600 font-medium leading-tight">{alert.message}</p>
          </div>
          <button className="text-gray-300 hover:text-gray-500">×</button>
        </div>
      ))}
    </div>
  );
};

export default AlertsWidget;
