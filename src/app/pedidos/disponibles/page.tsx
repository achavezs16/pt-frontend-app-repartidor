'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PedidoCard } from '@/components/PedidoCard';
import EstadoBadge from '@/components/EstadoBadge';
import Button from '@/components/ui/pymetrack-ui-lib/Button';
import { usePedidos } from '@/hooks/usePedidos';
import { Pedido, EstadoPedido } from '@/types/pedido';

export default function PedidosDisponibles() {
  const router = useRouter();
  const { pedidosDisponibles, loading, error, aceptarPedido, rechazarPedido } = usePedidos();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Verificar autenticación y actualizar tiempo
  useEffect(() => {
    const token = localStorage.getItem('repartidor_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Actualizar tiempo solo en el cliente
    setCurrentTime(new Date().toLocaleTimeString('es-CL', { hour12: false }));
  }, [router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // El hook usePedidos ya maneja la recarga
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleAceptarPedido = async (pedidoId: number) => {
    try {
      await aceptarPedido(pedidoId);
      // Éxito - el hook actualizará la lista automáticamente
    } catch (error) {
      console.error('Error al aceptar pedido:', error);
    }
  };

  const handleRechazarPedido = async (pedidoId: number) => {
    try {
      await rechazarPedido(pedidoId, 'Pedido rechazado por el repartidor');
      // Éxito - el hook actualizará la lista automáticamente
    } catch (error) {
      console.error('Error al rechazar pedido:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                📦 Pedidos Disponibles
              </h1>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg 
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && !refreshing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando pedidos disponibles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar pedidos</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Reintentar
            </Button>
          </div>
        ) : pedidosDisponibles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay pedidos disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              No tienes nuevos pedidos para aceptar en este momento.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Sugerencias</h4>
              <ul className="text-xs text-blue-700 text-left space-y-1">
                <li>• Actualiza la página para ver nuevos pedidos</li>
                <li>• Revisa tus entregas activas</li>
                <li>• Mantén la app abierta para recibir notificaciones</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Contador de pedidos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    📋 {pedidosDisponibles.length} pedidos disponibles
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">
                    Actúa rápido para aceptarlos antes que otros repartidores
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {pedidosDisponibles.length}
                </div>
              </div>
            </div>

            {/* Lista de pedidos */}
            <div className="space-y-4">
              {pedidosDisponibles.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <PedidoCard 
                    pedido={pedido}
                    onAceptar={() => handleAceptarPedido(pedido.id)}
                    onRechazar={() => handleRechazarPedido(pedido.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Pedidos disponibles</span>
            <span>Última actualización: {currentTime || 'Cargando...'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
