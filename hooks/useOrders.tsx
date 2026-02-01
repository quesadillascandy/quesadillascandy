
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Order, OrderStatus, UserRole, OrderItem } from '../types';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!profile || !user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      let query = supabase
        .from('pedidos')
        .select(`
          *,
          items_pedido (
            id,
            id_producto,
            nombre_producto,
            cantidad,
            precio_unitario,
            total
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrar según rol
      if (profile.role === UserRole.PROD_MANAGER) {
        // Gerente ve solo confirmados en adelante (no pendientes ni cancelados)
        query = query.not('estado', 'in', `(${OrderStatus.PENDIENTE},${OrderStatus.CANCELADO})`);
      } else if (![UserRole.ADMIN, UserRole.FINANCIAL_ANALYST].includes(profile.role)) {
        // Clientes ven solo sus propios pedidos
        query = query.eq('id_usuario', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error cargando pedidos:', error);
        setOrders([]);
        setLoading(false);
        return;
      }

      // Transformar datos de Supabase a formato de la app
      const transformedOrders: Order[] = (data || []).map((pedido: any) => ({
        id: pedido.id,
        user_id: pedido.id_usuario,
        user_name: pedido.nombre_usuario,
        user_role: pedido.rol_usuario as UserRole,
        status: pedido.estado as OrderStatus,
        items: (pedido.items_pedido || []).map((item: any) => ({
          id: item.id,
          product_id: item.id_producto,
          product_name: item.nombre_producto,
          quantity: parseFloat(item.cantidad),
          unit_price: parseFloat(item.precio_unitario),
          total: parseFloat(item.total),
        })),
        total: parseFloat(pedido.total),
        notes: pedido.notas,
        delivery_date: pedido.fecha_entrega,
        payment_method: pedido.metodo_pago,
        received_by: pedido.recibido_por,
        source: pedido.origen,
        created_at: pedido.created_at,
        updated_at: pedido.updated_at,
      }));

      setOrders(transformedOrders);
      setLoading(false);
    } catch (err) {
      console.error('Error inesperado cargando pedidos:', err);
      setOrders([]);
      setLoading(false);
    }
  }, [profile, user]);

  useEffect(() => {
    loadOrders();

    // Suscripción a cambios en tiempo real
    const subscription = supabase
      .channel('pedidos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pedidos',
        },
        (payload) => {
          console.log('Cambio en pedidos:', payload);
          loadOrders(); // Recargar cuando hay cambios
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadOrders]);

  const createOrder = async (
    items: OrderItem[],
    notes: string,
    deliveryDate: string,
    source: 'app' | 'whatsapp' = 'app'
  ) => {
    if (!profile || !user) {
      alert('Debes estar autenticado para crear un pedido');
      return null;
    }

    try {
      const total = items.reduce((sum, item) => sum + item.total, 0);

      // 1. Crear pedido
      const { data: pedidoData, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          id_usuario: user.id,
          nombre_usuario: profile.full_name,
          rol_usuario: profile.role,
          estado: OrderStatus.PENDIENTE,
          total,
          notas: notes,
          fecha_entrega: deliveryDate,
          origen: source,
        })
        .select()
        .single();

      if (pedidoError) {
        console.error('Error creando pedido:', pedidoError);
        alert(`Error al crear pedido: ${pedidoError.message}`);
        return null;
      }

      // 2. Crear items del pedido
      const itemsToInsert = items.map((item) => ({
        id_pedido: pedidoData.id,
        id_producto: item.product_id,
        nombre_producto: item.product_name,
        cantidad: item.quantity,
        precio_unitario: item.unit_price,
        total: item.total,
      }));

      const { error: itemsError } = await supabase
        .from('items_pedido')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Error creando items:', itemsError);
        alert(`Error al crear items del pedido: ${itemsError.message}`);
        // Intentar eliminar el pedido huérfano
        await supabase.from('pedidos').delete().eq('id', pedidoData.id);
        return null;
      }

      // 3. Recargar pedidos
      await loadOrders();

      console.log(`✅ Nuevo pedido creado: ${pedidoData.id}`);
      return pedidoData;
    } catch (err) {
      console.error('Error inesperado creando pedido:', err);
      alert('Error al crear el pedido');
      return null;
    }
  };

  const updateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    extraData?: { payment_method?: string; received_by?: string }
  ) => {
    try {
      const updateData: any = {
        estado: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (extraData?.payment_method) {
        updateData.metodo_pago = extraData.payment_method;
      }

      if (extraData?.received_by) {
        updateData.recibido_por = extraData.received_by;
      }

      const { error } = await supabase
        .from('pedidos')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        console.error('Error actualizando pedido:', error);
        alert(`Error al actualizar estado: ${error.message}`);
        return;
      }

      console.log(`✅ Pedido ${orderId} actualizado a ${newStatus}`);
      await loadOrders();
    } catch (err) {
      console.error('Error inesperado actualizando pedido:', err);
      alert('Error al actualizar el pedido');
    }
  };

  return { orders, loading, createOrder, updateStatus, refresh: loadOrders };
};
