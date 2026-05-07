// Estados del Pedido
export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  DISPONIBLE = 'DISPONIBLE',
  ASIGNADO = 'ASIGNADO',
  PEDIDO_RETIRADO = 'PEDIDO_RETIRADO',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
  RECHAZADO = 'RECHAZADO'
}

// Producto del Pedido
export interface ProductoPedido {
  id: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  imagenUrl?: string;
}

// Cliente del Pedido
export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email?: string;
}

// Dirección de Entrega
export interface DireccionEntrega {
  calle: string;
  numero: string;
  comuna: string;
  ciudad: string;
  referencia?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

// Pedido completo
export interface Pedido {
  id: number;
  numeroOrdenPyme: string;
  cliente: Cliente;
  direccionEntrega: DireccionEntrega;
  direccionRetiro?: string;
  productos: ProductoPedido[];
  total: number;
  estado: EstadoPedido;
  fechaCreacion: string;
  fechaAsignacion?: string;
  fechaRetiro?: string;
  fechaEntrega?: string;
  repartidorId?: number;
  notas?: string;
}

// Request para cambiar estado
export interface CambiarEstadoRequest {
  estado: EstadoPedido;
  notas?: string;
  motivoRechazo?: string;
}

// Pedido disponible para asignación
export interface PedidoDisponible extends Pedido {
  tiempoEstimadoEntrega: number; // en minutos
  distancia: number; // en km
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
}

// Estadísticas del repartidor
export interface EstadisticasRepartidor {
  pedidosHoy: number;
  pedidosEntregadosHoy: number;
  tiempoPromedioEntrega: number; // en minutos
  totalKilometros: number;
  calificacionPromedio: number;
}
