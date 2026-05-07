'use client';

import { useState, useRef, useCallback } from 'react';

interface UseCameraReturn {
  stream: MediaStream | null;
  loading: boolean;
  error: string | null;
  facingMode: 'user' | 'environment';
  iniciarCamara: (facingMode?: 'user' | 'environment') => Promise<void>;
  detenerCamara: () => void;
  tomarFoto: (width?: number, height?: number) => Promise<string>;
  cambiarCamara: () => Promise<void>;
}

export const useCamera = (): UseCameraReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);

  const iniciarCamara = useCallback(async (preferredFacingMode: 'user' | 'environment' = 'environment') => {
    try {
      setLoading(true);
      setError(null);

      // Detener cámara actual si está activa
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: preferredFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setFacingMode(preferredFacingMode);

      // Asignar stream al video si existe
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

    } catch (err) {
      let mensaje = 'Error al acceder a la cámara';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          mensaje = 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración del navegador.';
        } else if (err.name === 'NotFoundError') {
          mensaje = 'No se encontró ninguna cámara en el dispositivo.';
        } else if (err.name === 'NotReadableError') {
          mensaje = 'La cámara está siendo utilizada por otra aplicación.';
        } else if (err.name === 'OverconstrainedError') {
          mensaje = 'La cámara no cumple con los requisitos solicitados.';
        }
      }
      
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, [stream]);

  const detenerCamara = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const tomarFoto = useCallback(async (width: number = 1280, height: number = 720): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !stream) {
        reject(new Error('La cámara no está activa'));
        return;
      }

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('No se pudo crear el contexto del canvas'));
        return;
      }

      // Configurar dimensiones del canvas
      canvas.width = width;
      canvas.height = height;

      // Dibujar el frame actual del video en el canvas
      context.drawImage(video, 0, 0, width, height);

      // Convertir a base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      resolve(imageData);
    });
  }, [stream]);

  const cambiarCamara = useCallback(async () => {
    const nuevoFacingMode = facingMode === 'user' ? 'environment' : 'user';
    await iniciarCamara(nuevoFacingMode);
  }, [facingMode, iniciarCamara]);

  // Limpiar al desmontar
  const cleanup = useCallback(() => {
    detenerCamara();
  }, [detenerCamara]);

  return {
    stream,
    loading,
    error,
    facingMode,
    iniciarCamara,
    detenerCamara,
    tomarFoto,
    cambiarCamara,
  };
};
