import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Pedido, EstadoPedido, CambiarEstadoRequest, PedidoDisponible } from '@/types/pedido';
import { Repartidor, SesionRepartidor } from '@/types/repartidor';
import { EvidenciaEntrega, RegistrarEvidenciaRequest } from '@/types/evidencia';

// Configuración base de API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/api/v1';

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

const mapPedidoBackendToFrontend = (pedido: any): Pedido => ({
  id: pedido.id,
  numeroOrdenPyme: pedido.numeroOrdenPyme,

  cliente: {
    id: 0,
    nombre: pedido.nombreCliente,
    telefono: pedido.telefonoCliente || '',
    email: pedido.emailCliente,
  },

  direccionEntrega: {
    calle: pedido.direccionEntregaChile,
    numero: '',
    comuna: pedido.comunaEntregaChile,
    ciudad: pedido.regionEntregaChile,
  },

  direccionRetiro: 'Centro de distribución PymeTrack',
  productos: [
      {
        id: pedido.id,
        nombre: `Pedido ${pedido.numeroOrdenPyme}`,
        cantidad: 1,
        precioUnitario: pedido.totalPedido,
        subtotal: pedido.totalPedido,
      },
  ],
  total: pedido.totalPedido,
  estado: pedido.estadoPedidoPyme as EstadoPedido,
  fechaCreacion: pedido.creadoEn,
  notas: pedido.notasPedido,
  repartidorId: pedido.repartidorId,
});

// API de Autenticación
export const authAPI = {
  login: async (rut: string, password: string): Promise<SesionRepartidor> => {
    const response: AxiosResponse<SesionRepartidor> = await apiClient.post('/auth/login', {
      rut,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('repartidor_token');
    localStorage.removeItem('repartidor_datos');
  },

  refreshToken: async (): Promise<SesionRepartidor> => {
    const response: AxiosResponse<SesionRepartidor> = await apiClient.post('/auth/refresh');
    return response.data;
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await apiClient.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },
};

export const pedidosAPI = {
  getPedidosDisponibles: async (): Promise<PedidoDisponible[]> => {
    const response = await apiClient.get('/pedidos');

    return response.data
      .filter((pedido: any) => pedido.estadoPedidoPyme === EstadoPedido.DISPONIBLE)
      .map((pedido: any) => ({
        ...mapPedidoBackendToFrontend(pedido),
        tiempoEstimadoEntrega: 35,
        distancia: 4.2,
        prioridad: 'MEDIA',
      }));
  },

  getMisPedidos: async (): Promise<Pedido[]> => {
    const response = await apiClient.get('/pedidos');

    return response.data
      .filter((pedido: any) =>
        [
          EstadoPedido.ASIGNADO,
          EstadoPedido.PEDIDO_RETIRADO,
          EstadoPedido.EN_CAMINO,
          EstadoPedido.ENTREGADO,
        ].includes(pedido.estadoPedidoPyme)
      )
      .map(mapPedidoBackendToFrontend);
  },

  getPedido: async (pedidoId: number): Promise<Pedido> => {
    const response = await apiClient.get(`/pedidos/${pedidoId}`);
    return mapPedidoBackendToFrontend(response.data);
  },

  aceptarPedido: async (pedidoId: number): Promise<Pedido> => {
    const response = await apiClient.post(`/pedidos/${pedidoId}/aceptar?repartidorId=1`);
    return mapPedidoBackendToFrontend(response.data);
  },

  rechazarPedido: async (pedidoId: number, motivo: string): Promise<void> => {
    await apiClient.post(`/pedidos/${pedidoId}/rechazar?repartidorId=1`);
  },

  cambiarEstado: async (pedidoId: number, request: CambiarEstadoRequest): Promise<Pedido> => {
    const response = await apiClient.patch(`/pedidos/${pedidoId}/estado`, {
      estado: request.estado,
      repartidorId: request.repartidorId || 1,
      observacion: request.observacion || request.observacion || '',
    });

    return mapPedidoBackendToFrontend(response.data);
  },

  getHistorialPedidos: async (pagina: number = 1, limite: number = 20) => {
    const response = await apiClient.get('/pedidos');

    const pedidos = response.data
      .filter((pedido: any) =>
        [EstadoPedido.ENTREGADO, EstadoPedido.CANCELADO, EstadoPedido.RECHAZADO]
          .includes(pedido.estadoPedidoPyme)
      )
      .map(mapPedidoBackendToFrontend);

    return {
      pedidos,
      total: pedidos.length,
      pagina,
      totalPaginas: 1,
    };
  },
};

// API de Evidencia
export const evidenciaAPI = {
  // Registrar evidencia de entrega
  registrarEvidencia: async (request: RegistrarEvidenciaRequest): Promise<EvidenciaEntrega> => {
    const response: AxiosResponse<EvidenciaEntrega> = await apiClient.post('/evidencia', request);
    return response.data;
  },

  // Obtener evidencia de un pedido
  getEvidencia: async (pedidoId: number): Promise<EvidenciaEntrega> => {
    const response: AxiosResponse<EvidenciaEntrega> = await apiClient.get(`/evidencia/${pedidoId}`);
    return response.data;
  },
};

// API de Repartidor
export const repartidorAPI = {
  // Obtener información del repartidor
  getPerfil: async (): Promise<Repartidor> => {
    const response: AxiosResponse<Repartidor> = await apiClient.get('/perfil');
    return response.data;
  },

  // Actualizar ubicación del repartidor
  actualizarUbicacion: async (lat: number, lng: number): Promise<void> => {
    await apiClient.post('/ubicacion', { lat, lng });
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
    }> = await apiClient.get('/estadisticas');
    return response.data;
  },

  // Enviar mensaje de emergencia
  enviarEmergencia: async (mensaje: string, ubicacion: { lat: number; lng: number }): Promise<void> => {
    await apiClient.post('/emergencia', { mensaje, ubicacion });
  },
};

// Exportar cliente API por si se necesita directamente
export default apiClient;
