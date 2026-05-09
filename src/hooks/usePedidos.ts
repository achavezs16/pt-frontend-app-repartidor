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

      const [disponibles, asignados] = await Promise.all([
        pedidosAPI.getPedidosDisponibles(),
        pedidosAPI.getMisPedidos(),
      ]);

      setPedidosDisponibles(disponibles);
      setMisPedidos(asignados);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar los pedidos'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const aceptarPedido = useCallback(async (pedidoId: number) => {
    try {

      await pedidosAPI.aceptarPedido(pedidoId);

      await refrescarPedidos();

      console.log(`Pedido ${pedidoId} aceptado exitosamente`);

    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : 'Error al aceptar el pedido'
      );
    }
  }, [refrescarPedidos]);

  const rechazarPedido = useCallback(async (pedidoId: number, motivo: string) => {
    try {

      await pedidosAPI.rechazarPedido(pedidoId, motivo);

      await refrescarPedidos();

      console.log(`Pedido ${pedidoId} rechazado`);

    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : 'Error al rechazar el pedido'
      );
    }
  }, [refrescarPedidos]);

  const cambiarEstado = useCallback(
    async (
      pedidoId: number,
      estado: EstadoPedido,
      notas?: string
    ) => {
      try {

        await pedidosAPI.cambiarEstado(pedidoId, {
          estado,
          repartidorId: 1,
          observacion: notas,
        });

        await refrescarPedidos();

        console.log(
          `Pedido ${pedidoId} actualizado a estado: ${estado}`
        );

      } catch (err) {
        throw new Error(
          err instanceof Error
            ? err.message
            : 'Error al cambiar el estado del pedido'
        );
      }
    },
    [refrescarPedidos]
  );

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
