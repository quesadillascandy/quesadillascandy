
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { OrderItem } from '../../types';

interface Props {
  onSubmit: (items: OrderItem[], notes: string, deliveryDate: string) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true);

        if (fetchError) {
          console.error('Error fetching products:', fetchError);
          throw new Error('No se pudieron cargar los productos');
        }

        if (!data || data.length === 0) {
          throw new Error('No hay productos disponibles');
        }

        const mappedItems = data.map(p => ({
          product_id: p.id,
          product_name: p.nombre,
          quantity: 0,
          unit_price: p.precios?.[profile?.role || 'minorista'] || 0
        }));

        setItems(mappedItems);
        showToast('Productos cargados correctamente', 'success');
      } catch (err: any) {
        console.error('Error al cargar productos:', err);
        setError(err.message || 'Error al cargar productos');
        showToast(err.message || 'Error al cargar productos', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role) {
      fetchProducts();
    }
  }, [profile?.role, showToast]);

  const updateQty = (idx: number, value: string) => {
    const qty = parseInt(value) || 0;
    const newItems = [...items];
    newItems[idx].quantity = Math.max(0, qty);
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

    // Validaciones
    if (filteredItems.length === 0) {
      showToast('Por favor, selecciona al menos un producto', 'warning');
      return;
    }

    if (!deliveryDate) {
      showToast('Por favor, selecciona la fecha de entrega', 'warning');
      return;
    }

    if (!deliveryTime) {
      showToast('Por favor, selecciona la hora de retiro', 'warning');
      return;
    }

    // Combinar fecha y hora
    const deliveryDateTime = `${deliveryDate}T${deliveryTime}:00`;

    try {
      onSubmit(filteredItems, notes, deliveryDateTime);
      showToast('Pedido creado exitosamente', 'success');
    } catch (err) {
      showToast('Error al crear el pedido', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-xl border animate-slideUp">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando productos disponibles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-xl border animate-slideUp">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-bold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary underline hover:no-underline"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border animate-slideUp">
      <h3 className="text-xl font-bold mb-4 text-primary">Nuevo Pedido</h3>
      <p className="text-sm text-gray-500 mb-6">
        Lista de precios aplicada: <span className="font-bold text-secondary uppercase">{profile?.role}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lista de Productos */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Productos</label>
          {items.map((item, idx) => (
            <div
              key={item.product_id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors"
            >
              <div className="flex-1">
                <p className="font-bold text-gray-900">{item.product_name}</p>
                <p className="text-xs text-gray-500">
                  ${item.unit_price.toFixed(2)} / unidad
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-500 font-medium">Cantidad:</label>
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateQty(idx, e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Fecha y Hora de Entrega */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
              Fecha de Entrega
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
              Hora de Retiro
            </label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={deliveryTime}
              onChange={e => setDeliveryTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Notas Especiales */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
            Notas Especiales (Opcional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="Ej: Empaque especial para exportación, retiro en almacén B..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Total y Botones */}
        <div className="pt-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">Total a Pagar</p>
            <p className="text-3xl font-black text-secondary">
              ${total.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 md:flex-none px-6 py-3 text-gray-600 font-bold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 md:flex-none bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:brightness-110 transition-all hover:shadow-xl"
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
