'use client';

import React from 'react';
import { EstadoPedido } from '@/types/pedido';
import { cn } from '@/lib/utils';

interface EstadoBadgeProps {
  estado: EstadoPedido;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const estadoConfig = {
  [EstadoPedido.PENDIENTE]: {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '⏳',
    label: 'Pendiente',
  },
  [EstadoPedido.DISPONIBLE]: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🔔',
    label: 'Disponible',
  },
  [EstadoPedido.ASIGNADO]: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅',
    label: 'Asignado',
  },
  [EstadoPedido.PEDIDO_RETIRADO]: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '📦',
    label: 'Retirado',
  },
  [EstadoPedido.EN_CAMINO]: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '🚚',
    label: 'En Camino',
  },
  [EstadoPedido.ENTREGADO]: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '✅',
    label: 'Entregado',
  },
  [EstadoPedido.CANCELADO]: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '❌',
    label: 'Cancelado',
  },
  [EstadoPedido.RECHAZADO]: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '🚫',
    label: 'Rechazado',
  },
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs font-medium',
  md: 'px-3 py-1.5 text-sm font-medium',
  lg: 'px-4 py-2 text-base font-medium',
};

const iconSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ 
  estado, 
  className, 
  showIcon = true,
  size = 'md'
}) => {
  const config = estadoConfig[estado];
  
  if (!config) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border',
        config.color,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`Estado: ${config.label}`}
    >
      {showIcon && (
        <span className={iconSizeClasses[size]} aria-hidden="true">
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
};

// Componente para mostrar estado con animación de cambio
interface EstadoBadgeAnimadoProps extends EstadoBadgeProps {
  estadoAnterior?: EstadoPedido;
}

export const EstadoBadgeAnimado: React.FC<EstadoBadgeAnimadoProps> = ({ 
  estado, 
  estadoAnterior,
  className, 
  showIcon = true,
  size = 'md'
}) => {
  const config = estadoConfig[estado];
  const configAnterior = estadoAnterior ? estadoConfig[estadoAnterior] : null;
  const haCambiado = estadoAnterior && estadoAnterior !== estado;

  return (
    <div className="relative">
      {haCambiado && configAnterior && (
        <div
          className={cn(
            'absolute inset-0 inline-flex items-center gap-1 rounded-full border',
            configAnterior.color,
            sizeClasses[size],
            'animate-ping opacity-75'
          )}
        >
          {showIcon && (
            <span className={iconSizeClasses[size]} aria-hidden="true">
              {configAnterior.icon}
            </span>
          )}
          <span>{configAnterior.label}</span>
        </div>
      )}
      
      <EstadoBadge
        estado={estado}
        className={cn(
          haCambiado && 'animate-in fade-in-0 zoom-in-95 duration-300',
          className
        )}
        showIcon={showIcon}
        size={size}
      />
    </div>
  );
};

export default EstadoBadge;
