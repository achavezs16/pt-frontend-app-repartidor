// Información del Repartidor
export interface Repartidor {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  rut: string;
  vehiculo: Vehiculo;
  estado: 'ACTIVO' | 'INACTIVO' | 'OCUPADO';
  zonaCobertura: ZonaCobertura;
  calificacion: number;
  totalEntregas: number;
  fechaUltimaEntrega?: string;
}

// Vehículo del Repartidor
export interface Vehiculo {
  tipo: 'MOTO' | 'AUTO' | 'BICICLETA';
  marca: string;
  modelo: string;
  patente: string;
  color: string;
  foto?: string;
}

// Zona de Cobertura
export interface ZonaCobertura {
  id: number;
  nombre: string;
  comunas: string[];
  coordenadas?: {
    centro: { lat: number; lng: number };
    radio: number; // en km
  };
}

// Ubicación actual del repartidor
export interface UbicacionActual {
  lat: number;
  lng: number;
  precision: number; // en metros
  timestamp: string;
}

// Estado de sesión del repartidor
export interface SesionRepartidor {
  token: string;
  repartidor: Repartidor;
  fechaInicio: string;
  fechaUltimaActividad: string;
  dispositivo: {
    tipo: 'MOVIL' | 'TABLET';
    modelo: string;
    versionApp: string;
  };
}

// Configuración de notificaciones
export interface ConfiguracionNotificaciones {
  push: boolean;
  email: boolean;
  sms: boolean;
  nuevosPedidos: boolean;
  cambiosEstado: boolean;
  mensajesSupervisor: boolean;
}

// Métricas de rendimiento
export interface MetricasRendimiento {
  pedidosHoy: number;
  pedidosSemana: number;
  pedidosMes: number;
  tiempoPromedioEntrega: number; // minutos
  distanciaTotal: number; // km
  efectividadEntrega: number; // porcentaje
  calificacionPromedio: number; // 1-5
}
