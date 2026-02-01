
import React, { useState } from 'react';
import { InventoryItem, MovementType } from '../../types';

interface Props {
  item: InventoryItem;
  onConfirm: (data: any) => Promise<void>;
  onClose: () => void;
}

const MovementForm: React.FC<Props> = ({ item, onConfirm, onClose }) => {
  const [type, setType] = useState<MovementType>(MovementType.OUT);
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(item.last_price);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Campos para lotes
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const isPerecedero = item.category === 'PERECEDERO';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return alert("Cantidad inválida");
    
    // Validación de fecha para perecederos en entrada
    if (type === MovementType.IN && isPerecedero && !expiryDate) {
      return alert("La fecha de vencimiento es obligatoria para productos perecederos.");
    }

    setLoading(true);
    try {
      await onConfirm({
        item_id: item.id,
        type,
        quantity,
        unit_price: type === MovementType.IN ? unitPrice : undefined,
        reason,
        batch_number: batchNumber,
        expiry_date: expiryDate
      });
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        <header className="bg-primary p-6 text-white">
          <h2 className="text-xl font-black uppercase tracking-widest">Registrar Movimiento</h2>
          <p className="text-white/70 text-sm">Ítem: {item.name}</p>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {Object.values(MovementType).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  type === t ? 'bg-white text-primary shadow-sm' : 'text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Cantidad ({item.unit})</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold"
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value))}
                required
              />
            </div>
            {type === MovementType.IN && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Precio Unitario ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary"
                  value={unitPrice}
                  onChange={e => setUnitPrice(parseFloat(e.target.value))}
                  required
                />
              </div>
            )}
          </div>

          {/* Campos de Lote (Solo en Entrada) */}
          {type === MovementType.IN && (
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 space-y-3">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Datos del Lote</p>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Número de Lote (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg bg-white text-sm"
                  placeholder="Ej: L-2023-A"
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Fecha de Vencimiento {isPerecedero && '*'}</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-lg bg-white text-sm"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  required={isPerecedero}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Motivo / Justificación</label>
            <textarea 
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary h-20 text-sm"
              placeholder="Ej: Reposición de stock semanal, merma por vencimiento..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-400 font-bold text-sm"
            >Cancelar</button>
            <button 
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                type === MovementType.IN ? 'bg-success' : type === MovementType.OUT ? 'bg-secondary' : 'bg-primary'
              } ${loading ? 'opacity-50 animate-pulse' : 'hover:scale-105'}`}
            >
              {loading ? 'Procesando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementForm;
