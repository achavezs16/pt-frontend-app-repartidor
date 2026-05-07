'use client';

import { useState, useEffect, useCallback } from 'react';

interface Ubicacion {
  lat: number;
  lng: number;
  precision: number;
  timestamp: string;
}

interface UseLocationReturn {
  ubicacion: Ubicacion | null;
  loading: boolean;
  error: string | null;
  permisoConcedido: boolean;
  solicitarPermiso: () => Promise<void>;
  obtenerUbicacionActual: () => Promise<Ubicacion>;
  iniciarSeguimiento: () => void;
  detenerSeguimiento: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permisoConcedido, setPermisoConcedido] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const solicitarPermiso = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setPermisoConcedido(permission.state === 'granted');

      if (permission.state === 'prompt') {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setPermisoConcedido(true);
        return;
      }

      if (permission.state === 'denied') {
        throw new Error('El permiso de ubicación fue denegado. Por favor, habilítalo en la configuración del navegador.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar permiso de ubicación');
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerUbicacionActual = useCallback(async (): Promise<Ubicacion> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const ubicacion: Ubicacion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            precision: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };
          setUbicacion(ubicacion);
          resolve(ubicacion);
        },
        (error) => {
          let mensaje = 'Error al obtener la ubicación';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              mensaje = 'Permiso de ubicación denegado';
              break;
            case error.POSITION_UNAVAILABLE:
              mensaje = 'Información de ubicación no disponible';
              break;
            case error.TIMEOUT:
              mensaje = 'Tiempo de espera agotado al obtener ubicación';
              break;
          }
          
          setError(mensaje);
          reject(new Error(mensaje));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minuto de caché
        }
      );
    });
  }, []);

  const iniciarSeguimiento = useCallback(() => {
    if (watchId !== null) return;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const ubicacion: Ubicacion = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          precision: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };
        setUbicacion(ubicacion);
      },
      (error) => {
        console.error('Error en seguimiento de ubicación:', error);
        setError('Error en seguimiento de ubicación');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000, // 30 segundos de caché
      }
    );

    setWatchId(id);
  }, [watchId]);

  const detenerSeguimiento = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    // Verificar permiso inicial
    navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
      setPermisoConcedido(permission.state === 'granted');
    });

    return () => {
      detenerSeguimiento();
    };
  }, [detenerSeguimiento]);

  return {
    ubicacion,
    loading,
    error,
    permisoConcedido,
    solicitarPermiso,
    obtenerUbicacionActual,
    iniciarSeguimiento,
    detenerSeguimiento,
  };
};
