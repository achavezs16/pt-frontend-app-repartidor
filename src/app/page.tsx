'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePedidos } from '@/hooks/usePedidos';

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [repartidor, setRepartidor] = useState<any>(null);
  const router = useRouter();
  const { pedidosDisponibles, misPedidos } = usePedidos();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('repartidor_token');
    const datos = localStorage.getItem('repartidor_datos');
    
    if (!token || !datos) {
      // Redirigir al login si no está autenticado
      router.push('/login');
      return;
    }
    
    try {
      const parsedDatos = JSON.parse(datos);
      setRepartidor(parsedDatos);
      setIsAuthenticated(true);
    } catch (error) {
      // Si hay error en los datos, redirigir al login
      localStorage.removeItem('repartidor_token');
      localStorage.removeItem('repartidor_datos');
      router.push('/login');
      return;
    }

    // Verificar estado de conexión
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar soporte PWA
    setSupportsPWA('serviceWorker' in navigator && 'PushManager' in window);
    
    // Escuchar evento de instalación PWA
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [router]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('repartidor_token');
    localStorage.removeItem('repartidor_datos');
    router.push('/login');
  };

  const pedidosHoy = pedidosDisponibles.length + misPedidos.length;
    const entregadosHoy = misPedidos.filter(
      (pedido) => pedido.estado === 'ENTREGADO'
  ).length;

  // Mostrar loading mientras verifica autenticación
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-4">🚚</div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">🚚</div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">PymeTrack Repartidor</h1>
                {repartidor && (
                  <p className="text-sm text-gray-600">
                    ¡Hola, {repartidor.nombre}! 👋
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Estado de conexión */}
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {isOnline ? 'Conectado' : 'Sin conexión'}
              </div>
              
              {/* Botón de logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors min-h-[44px]"
              >
                🚪 Salir
              </button>
              
              {/* Botón de instalación PWA */}
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
                >
                  📱 Instalar App
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          {/* Icono principal */}
          <div className="text-6xl mb-6">🚚</div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Hola, {repartidor?.nombre}! 👋
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Revisa tus pedidos disponibles y gestionados hoy
          </p>
          
          {/* Resumen del día */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Tu Día</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pedidosHoy}</div>
                <div className="text-sm text-gray-600">Pedidos Hoy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{entregadosHoy}</div>
                <div className="text-sm text-gray-600">Entregados</div>
              </div>
            </div>
          </div>
          
                    
          {/* Botones de acción */}
          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push('/pedidos/disponibles')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[48px]"
              disabled={!isOnline}
            >
              {isOnline ? '📦 Ver Pedidos Disponibles' : '📵 Esperando conexión...'}
            </button>
            
            <button
              onClick={() => router.push('/pedidos/activos')}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors min-h-[48px]"
              disabled={!isOnline}
            >
              🚚 Mis Entregas Activas
            </button>
            
            <button
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors min-h-[48px]"
              disabled={!isOnline}
            >
              ⚙️ Mi Perfil
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="text-center text-sm text-gray-500">
          PymeTrack Repartidor v1.0.0
        </div>
      </footer>
    </div>
  );
}
