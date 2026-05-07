'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pedido, EstadoPedido, PedidoDisponible } from '@/types/pedido';
import { pedidosAPI } from '@/lib/api';

interface UsePedidosReturn {
  pedidosDisponibles: PedidoDisponible[];
  misPedidos: Pedido[];
  loading: boolean;
  error: string | null;
  refrescarPedidos: () => Promise<void>;
  aceptarPedido: (pedidoId: number) => Promise<void>;
  rechazarPedido: (pedidoId: number, motivo: string) => Promise<void>;
  cambiarEstado: (pedidoId: number, estado: EstadoPedido, notas?: string) => Promise<void>;
}

export const usePedidos = (): UsePedidosReturn => {
  const [pedidosDisponibles, setPedidosDisponibles] = useState<PedidoDisponible[]>([]);
  const [misPedidos, setMisPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refrescarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Datos mock para desarrollo - reemplazar con API real cuando esté lista
      const mockDisponibles: PedidoDisponible[] = [
        {
          id: 1,
          numeroOrdenPyme: 'ORD-2024-001',
          cliente: {
            id: 1,
            nombre: 'María González',
            telefono: '+56 9 8765 4321',
            email: 'maria.gonzalez@email.cl',
          },
          direccionEntrega: {
            calle: 'Av. Principal',
            numero: '1234',
            comuna: 'Providencia',
            ciudad: 'Santiago',
            referencia: 'Departamento 802, frente al supermercado',
            coordenadas: { lat: -33.4489, lng: -70.6693 }
          },
          productos: [
            {
              id: 1,
              nombre: 'Pizza Familiar',
              cantidad: 2,
              precioUnitario: 15990,
              subtotal: 31980,
              imagenUrl: '/api/placeholder/60/60'
            },
            {
              id: 2,
              nombre: 'Bebida 2L',
              cantidad: 1,
              precioUnitario: 2990,
              subtotal: 2990,
              imagenUrl: '/api/placeholder/60/60'
            }
          ],
          total: 34970,
          estado: EstadoPedido.DISPONIBLE,
          fechaCreacion: new Date().toISOString(),
          tiempoEstimadoEntrega: 30,
          distancia: 2.5,
          prioridad: 'MEDIA' as const
        },
        {
          id: 2,
          numeroOrdenPyme: 'ORD-2024-002',
          cliente: {
            id: 2,
            nombre: 'Carlos Rodríguez',
            telefono: '+56 9 9876 5432',
            email: 'carlos.rodriguez@email.cl',
          },
          direccionEntrega: {
            calle: 'Calle Secundaria',
            numero: '567',
            comuna: 'Las Condes',
            ciudad: 'Santiago',
            referencia: 'Edificio Torre Central, piso 15',
            coordenadas: { lat: -33.4269, lng: -70.6067 }
          },
          productos: [
            {
              id: 3,
              nombre: 'Hamburguesa Completa',
              cantidad: 3,
              precioUnitario: 8990,
              subtotal: 26970,
              imagenUrl: '/api/placeholder/60/60'
            },
            {
              id: 4,
              nombre: 'Papas Fritas',
              cantidad: 3,
              precioUnitario: 3990,
              subtotal: 11970,
              imagenUrl: '/api/placeholder/60/60'
            }
          ],
          total: 38940,
          estado: EstadoPedido.DISPONIBLE,
          fechaCreacion: new Date().toISOString(),
          tiempoEstimadoEntrega: 25,
          distancia: 3.2,
          prioridad: 'ALTA' as const
        }
      ];

      // Mock de pedidos asignados
      const mockAsignados: Pedido[] = [
        {
          id: 3,
          numeroOrdenPyme: 'ORD-003',
          cliente: {
            id: 3,
            nombre: 'Carlos López',
            telefono: '+56 9 8765 4321',
            email: 'carlos.lopez@email.com'
          },
          direccionEntrega: {
            calle: 'Av. Providencia',
            numero: '1234',
            comuna: 'Providencia',
            ciudad: 'Santiago'
          },
          productos: [
            {
              id: 5,
              nombre: 'Hamburguesa Completa',
              cantidad: 2,
              precioUnitario: 8900,
              subtotal: 17800
            }
          ],
          total: 17800,
          estado: EstadoPedido.ASIGNADO,
          fechaCreacion: '2024-01-15T10:00:00Z',
          fechaAsignacion: new Date().toISOString(),
          repartidorId: 1,
          notas: 'Entregar con cuidado',
          direccionRetiro: 'Calle Los Leones 2345, Providencia, Santiago - Restaurante "El Sabor Chileno"'
        }
      ];

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      setPedidosDisponibles(mockDisponibles);
      setMisPedidos(mockAsignados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  const aceptarPedido = useCallback(async (pedidoId: number) => {
    try {
      // Simular API call con delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Encontrar el pedido a aceptar
      let pedidoAceptado: PedidoDisponible | undefined;
      
      setPedidosDisponibles(prev => {
        const pedido = prev.find(p => p.id === pedidoId);
        if (pedido) {
          pedidoAceptado = pedido;
        }
        return prev.filter(p => p.id !== pedidoId);
      });
      
      // Mover pedido a asignados
      if (pedidoAceptado) {
        setMisPedidos(prev => {
          const nuevoPedido: Pedido = {
            id: pedidoAceptado!.id,
            numeroOrdenPyme: pedidoAceptado!.numeroOrdenPyme,
            cliente: pedidoAceptado!.cliente,
            direccionEntrega: pedidoAceptado!.direccionEntrega,
            productos: pedidoAceptado!.productos,
            total: pedidoAceptado!.total,
            estado: EstadoPedido.ASIGNADO,
            fechaCreacion: pedidoAceptado!.fechaCreacion,
            fechaAsignacion: new Date().toISOString(),
            repartidorId: 1, // ID del repartidor logueado
            notas: 'Pedido aceptado por repartidor'
          };
          return [...prev, nuevoPedido];
        });
      }
      
      // Simular éxito
      console.log(`Pedido ${pedidoId} aceptado exitosamente`);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al aceptar el pedido');
    }
  }, []);

  const rechazarPedido = useCallback(async (pedidoId: number, motivo: string) => {
    try {
      // Simular API call con delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Actualizar estado local - eliminar pedido de disponibles
      setPedidosDisponibles(prev => prev.filter(p => p.id !== pedidoId));
      
      // Simular éxito
      console.log(`Pedido ${pedidoId} rechazado: ${motivo}`);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al rechazar el pedido');
    }
  }, []);

  const cambiarEstado = useCallback(async (pedidoId: number, estado: EstadoPedido, notas?: string) => {
    try {
      // Simular API call con delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Actualizar estado local del pedido
      setMisPedidos(prev => 
        prev.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, estado, notas: notas || pedido.notas }
            : pedido
        )
      );
      
      // Simular éxito
      console.log(`Pedido ${pedidoId} actualizado a estado: ${estado}`);
      if (notas) {
        console.log(`Notas: ${notas}`);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al cambiar el estado del pedido');
    }
  }, []);

  useEffect(() => {
    refrescarPedidos();

    // Configurar intervalo para refrescar automáticamente cada 30 segundos
    const interval = setInterval(refrescarPedidos, 30000);

    return () => clearInterval(interval);
  }, [refrescarPedidos]);

  return {
    pedidosDisponibles,
    misPedidos,
    loading,
    error,
    refrescarPedidos,
    aceptarPedido,
    rechazarPedido,
    cambiarEstado,
  };
};
