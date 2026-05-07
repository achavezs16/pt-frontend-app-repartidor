// Datos de quien recibe el pedido
export interface Receptor {
  nombre: string;
  rut: string;
  telefono?: string;
  relacion: 'CLIENTE' | 'FAMILIAR' | 'VECINO' | 'OTRO';
  firma: string; // Base64 de la firma
}

// Evidencia de entrega
export interface EvidenciaEntrega {
  id: number;
  pedidoId: number;
  repartidorId: number;
  fotoEntrega: string; // Base64 de la foto
  receptor: Receptor;
  notasAdicionales?: string;
  ubicacionEntrega: {
    lat: number;
    lng: number;
    precision: number;
  };
  fechaHora: string;
  confirmado: boolean;
}

// Request para registrar evidencia
export interface RegistrarEvidenciaRequest {
  pedidoId: number;
  fotoEntrega: string;
  receptor: Omit<Receptor, 'firma'> & { firma: string };
  notasAdicionales?: string;
  ubicacionEntrega: {
    lat: number;
    lng: number;
  };
}

// Estado del formulario de evidencia
export interface EstadoFormularioEvidencia {
  paso: 1 | 2 | 3; // 1: Foto, 2: Datos receptor, 3: Confirmación
  fotoTomada: boolean;
  datosReceptorCompletos: boolean;
  firmaCapturada: boolean;
  errores: {
    foto?: string;
    nombre?: string;
    rut?: string;
    firma?: string;
  };
}

// Configuración de cámara
export interface ConfiguracionCamara {
  facingMode: 'user' | 'environment';
  width: number;
  height: number;
  quality: number;
}

// Firma digital
export interface FirmaDigital {
  puntos: Array<{
    x: number;
    y: number;
    tiempo: number;
  }>;
  ancho: number;
  alto: number;
  imagenBase64: string;
}
