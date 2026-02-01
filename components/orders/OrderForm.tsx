
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { OrderItem } from '../../types';

interface Props {
  onSubmit: (items: OrderItem[], notes: string, deliveryDate: string) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true);

        if (error) throw error;

        if (data) {
          const mappedItems = data.map(p => ({
            product_id: p.id,
            product_name: p.nombre,
            quantity: 0,
            unit_price: p.precios[profile?.rol || 'minorista'] || 0
          }));
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [profile]);

  const updateQty = (idx: number, delta: number) => {
    const newItems = [...items];
    newItems[idx].quantity = Math.max(0, newItems[idx].quantity + delta);
    setItems(newItems);
  };

  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredItems = items
      .filter(i => i.quantity > 0)
      .map(i => ({
        ...i,
        id: Math.random().toString(36).substr(2, 9),
        total: i.quantity * i.unit_price
      }));

    if (filteredItems.length === 0) return alert("Selecciona al menos un producto");
    if (!deliveryDate) return alert("Selecciona fecha de entrega");

    onSubmit(filteredItems, notes, deliveryDate);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-xl border animate-slideUp">
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border animate-slideUp">
      <h3 className="text-xl font-bold mb-4 text-primary">Nuevo Pedido</h3>
      <p className="text-sm text-gray-500 mb-6">Lista de precios aplicada: <span className="font-bold text-secondary uppercase">{profile?.rol}</span></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.product_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="font-bold">{item.product_name}</p>
                <p className="text-xs text-gray-400">${item.unit_price} / unidad</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => updateQty(idx, -1)}
                  className="w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center font-bold"
                >-</button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQty(idx, 1)}
                  className="w-8 h-8 rounded-full bg-primary text-white shadow-sm flex items-center justify-center font-bold"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Fecha de Entrega</label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg"
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Notas Especiales</label>
            <textarea
              className="w-full p-2 border rounded-lg h-10"
              placeholder="Ej: Empaque especial para exportación..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Total a Pagar</p>
            <p className="text-3xl font-black text-secondary">${total.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-500 font-bold"
            >Cancelar</button>
            <button
              type="submit"
              className="bg-primary text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:brightness-110"
            >Confirmar Pedido</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
