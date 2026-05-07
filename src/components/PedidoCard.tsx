'use client';

import React from 'react';
import { Pedido, PedidoDisponible, EstadoPedido } from '@/types/pedido';
import { EstadoBadge } from '@/components/EstadoBadge';
import Tooltip from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

interface PedidoCardProps {
  pedido: Pedido | PedidoDisponible;
  onAceptar?: (pedidoId: number) => void;
  onRechazar?: (pedidoId: number) => void;
  onVerDetalle?: (pedidoId: number) => void;
  onIniciarTrayecto?: (pedidoId: number) => void;
  onRegistrarEntrega?: (pedidoId: number) => void;
  className?: string;
  loading?: boolean;
}

export const PedidoCard: React.FC<PedidoCardProps> = ({
  pedido,
  onAceptar,
  onRechazar,
  onVerDetalle,
  onIniciarTrayecto,
  onRegistrarEntrega,
  className,
  loading = false,
}) => {
  const esDisponible = pedido.estado === EstadoPedido.DISPONIBLE;
  const esAsignado = pedido.estado === EstadoPedido.ASIGNADO;
  const esRetirado = pedido.estado === EstadoPedido.PEDIDO_RETIRADO;
  const esEnCamino = pedido.estado === EstadoPedido.EN_CAMINO;

  const handleAbrirMaps = () => {
    const direccion = `${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.numero}, ${pedido.direccionEntrega.comuna}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
    window.open(url, '_blank');
  };

  const handleAbrirMapsRetiro = () => {
    if ('direccionRetiro' in pedido && pedido.direccionRetiro) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pedido.direccionRetiro)}`;
      window.open(url, '_blank');
    }
  };

  const handleLlamarCliente = () => {
    window.location.href = `tel:${pedido.cliente.telefono}`;
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200',
        'p-4 mb-4',
        esDisponible && 'border-blue-200 bg-blue-50',
        loading && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Pedido #{pedido.numeroOrdenPyme}
            </h3>
            <EstadoBadge estado={pedido.estado} size="sm" />
          </div>
          
          {esDisponible && 'distancia' in pedido && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                📍 {pedido.distancia} km
              </span>
              <span className="flex items-center gap-1">
                ⏱️ {pedido.tiempoEstimadoEntrega} min
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Tooltip content="Toca aquí para ver la ruta en Google Maps">
            <button
              onClick={handleAbrirMaps}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              aria-label="Ver en Maps"
            >
              📍
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Cliente y Dirección */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Cliente:</span>
            <p className="text-gray-900">{pedido.cliente.nombre}</p>
          </div>
          
          <button
            onClick={handleLlamarCliente}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            aria-label="Lamar cliente"
          >
            📞
          </button>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700">Dirección de Entrega:</span>
          <p className="text-gray-900 text-sm">
            {pedido.direccionEntrega.calle} {pedido.direccionEntrega.numero},{' '}
            {pedido.direccionEntrega.comuna}
          </p>
        </div>

        {/* Dirección de Retiro - solo para pedidos asignados */}
        {!esDisponible && 'direccionRetiro' in pedido && pedido.direccionRetiro && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-blue-800">🏪 Retirar en:</span>
              <button
                onClick={handleAbrirMapsRetiro}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Ver en Maps 📍
              </button>
            </div>
            <p className="text-blue-900 text-sm font-medium">
              {pedido.direccionRetiro}
            </p>
          </div>
        )}
      </div>

      {/* Productos */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-700">
          Productos ({pedido.productos.length}):
        </span>
        <div className="mt-1 space-y-1">
          {pedido.productos.slice(0, 3).map((producto, index) => (
            <div key={index} className="text-sm text-gray-600">
              • {producto.nombre} x{producto.cantidad}
            </div>
          ))}
          {pedido.productos.length > 3 && (
            <div className="text-sm text-gray-500">
              +{pedido.productos.length - 3} productos más
            </div>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">Total:</span>
        <span className="text-lg font-bold text-gray-900">
          ${pedido.total.toLocaleString('es-CL')}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        {esDisponible && (
          <>
            <button
              onClick={() => onAceptar?.(pedido.id)}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px]"
              disabled={loading}
            >
              {loading ? 'Procesando...' : '✅ Aceptar'}
            </button>
            <button
              onClick={() => onRechazar?.(pedido.id)}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors min-h-[44px]"
              disabled={loading}
            >
              ❌ Rechazar
            </button>
          </>
        )}

        {esAsignado && (
          <>
            <button
              onClick={handleAbrirMapsRetiro}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px]"
            >
              🏪 Ir a Tienda
            </button>
            <button
              onClick={() => onIniciarTrayecto?.(pedido.id)}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              🚚 Iniciar Entrega
            </button>
          </>
        )}

        {esRetirado && (
          <>
            <button
              onClick={() => onRegistrarEntrega?.(pedido.id)}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px]"
            >
              📸 Registrar Entrega
            </button>
            <button
              onClick={handleAbrirMaps}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              📍 Ver Ruta
            </button>
          </>
        )}

        {esEnCamino && (
          <>
            <button
              onClick={() => onRegistrarEntrega?.(pedido.id)}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[44px]"
            >
              📸 Registrar Entrega
            </button>
            <button
              onClick={handleAbrirMaps}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              📍 Navegar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
