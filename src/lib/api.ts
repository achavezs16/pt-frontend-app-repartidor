import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Pedido, EstadoPedido, CambiarEstadoRequest, PedidoDisponible } from '@/types/pedido';
import { Repartidor, SesionRepartidor } from '@/types/repartidor';
import { EvidenciaEntrega, RegistrarEvidenciaRequest } from '@/types/evidencia';

// Configuración base de API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('repartidor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('repartidor_token');
      localStorage.removeItem('repartidor_datos');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API de Autenticación
export const authAPI = {
  login: async (rut: string, password: string): Promise<SesionRepartidor> => {
    const response: AxiosResponse<SesionRepartidor> = await apiClient.post('/repartidor/auth/login', {
      rut,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/repartidor/auth/logout');
    localStorage.removeItem('repartidor_token');
    localStorage.removeItem('repartidor_datos');
  },

  refreshToken: async (): Promise<SesionRepartidor> => {
    const response: AxiosResponse<SesionRepartidor> = await apiClient.post('/repartidor/auth/refresh');
    return response.data;
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await apiClient.get('/repartidor/auth/verify');
      return true;
    } catch {
      return false;
    }
  },
};

// API de Pedidos
export const pedidosAPI = {
  // Obtener pedidos disponibles para asignación
  getPedidosDisponibles: async (): Promise<PedidoDisponible[]> => {
    const response: AxiosResponse<PedidoDisponible[]> = await apiClient.get('/repartidor/pedidos/disponibles');
    return response.data;
  },

  // Obtener pedidos asignados al repartidor
  getMisPedidos: async (): Promise<Pedido[]> => {
    const response: AxiosResponse<Pedido[]> = await apiClient.get('/repartidor/pedidos/asignados');
    return response.data;
  },

  // Obtener detalles de un pedido específico
  getPedido: async (pedidoId: number): Promise<Pedido> => {
    const response: AxiosResponse<Pedido> = await apiClient.get(`/repartidor/pedidos/${pedidoId}`);
    return response.data;
  },

  // Aceptar un pedido disponible
  aceptarPedido: async (pedidoId: number): Promise<Pedido> => {
    const response: AxiosResponse<Pedido> = await apiClient.post(`/repartidor/pedidos/${pedidoId}/aceptar`);
    return response.data;
  },

  // Rechazar un pedido disponible
  rechazarPedido: async (pedidoId: number, motivo: string): Promise<void> => {
    await apiClient.post(`/repartidor/pedidos/${pedidoId}/rechazar`, { motivo });
  },

  // Cambiar estado de un pedido asignado
  cambiarEstado: async (pedidoId: number, request: CambiarEstadoRequest): Promise<Pedido> => {
    const response: AxiosResponse<Pedido> = await apiClient.put(`/repartidor/pedidos/${pedidoId}/estado`, request);
    return response.data;
  },

  // Obtener historial de pedidos
  getHistorialPedidos: async (pagina: number = 1, limite: number = 20): Promise<{
    pedidos: Pedido[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> => {
    const response: AxiosResponse<{
      pedidos: Pedido[];
      total: number;
      pagina: number;
      totalPaginas: number;
    }> = await apiClient.get(`/repartidor/pedidos/historial?pagina=${pagina}&limite=${limite}`);
    return response.data;
  },
};

// API de Evidencia
export const evidenciaAPI = {
  // Registrar evidencia de entrega
  registrarEvidencia: async (request: RegistrarEvidenciaRequest): Promise<EvidenciaEntrega> => {
    const response: AxiosResponse<EvidenciaEntrega> = await apiClient.post('/repartidor/evidencia', request);
    return response.data;
  },

  // Obtener evidencia de un pedido
  getEvidencia: async (pedidoId: number): Promise<EvidenciaEntrega> => {
    const response: AxiosResponse<EvidenciaEntrega> = await apiClient.get(`/repartidor/evidencia/${pedidoId}`);
    return response.data;
  },
};

// API de Repartidor
export const repartidorAPI = {
  // Obtener información del repartidor
  getPerfil: async (): Promise<Repartidor> => {
    const response: AxiosResponse<Repartidor> = await apiClient.get('/repartidor/perfil');
    return response.data;
  },

  // Actualizar ubicación del repartidor
  actualizarUbicacion: async (lat: number, lng: number): Promise<void> => {
    await apiClient.post('/repartidor/ubicacion', { lat, lng });
  },

  // Obtener estadísticas
  getEstadisticas: async (): Promise<{
    pedidosHoy: number;
    pedidosEntregadosHoy: number;
    tiempoPromedioEntrega: number;
    totalKilometros: number;
    calificacionPromedio: number;
  }> => {
    const response: AxiosResponse<{
      pedidosHoy: number;
      pedidosEntregadosHoy: number;
      tiempoPromedioEntrega: number;
      totalKilometros: number;
      calificacionPromedio: number;
    }> = await apiClient.get('/repartidor/estadisticas');
    return response.data;
  },

  // Enviar mensaje de emergencia
  enviarEmergencia: async (mensaje: string, ubicacion: { lat: number; lng: number }): Promise<void> => {
    await apiClient.post('/repartidor/emergencia', { mensaje, ubicacion });
  },
};

// Exportar cliente API por si se necesita directamente
export default apiClient;
