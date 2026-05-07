'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PedidoCard } from '@/components/PedidoCard';
import EstadoBadge from '@/components/EstadoBadge';
import Button from '@/components/ui/Button';
import { usePedidos } from '@/hooks/usePedidos';
import { Pedido, EstadoPedido } from '@/types/pedido';

type FilterType = 'todos' | 'asignados' | 'retirados' | 'en_camino' | 'entregados';

export default function MisEntregasActivas() {
  const router = useRouter();
  const { misPedidos, loading, error, refrescarPedidos, cambiarEstado } = usePedidos();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

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
    await refrescarPedidos();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleRetirarPedido = async (pedidoId: number) => {
    try {
      await cambiarEstado(pedidoId, EstadoPedido.PEDIDO_RETIRADO, 'Pedido retirado en origen');
    } catch (error) {
      console.error('Error al retirar pedido:', error);
    }
  };

  const handleIniciarTrayecto = async (pedidoId: number) => {
    try {
      await cambiarEstado(pedidoId, EstadoPedido.EN_CAMINO, 'Iniciando trayecto hacia destino');
    } catch (error) {
      console.error('Error al iniciar trayecto:', error);
    }
  };

  const handleRegistrarEntrega = async (pedidoId: number) => {
    try {
      await cambiarEstado(pedidoId, EstadoPedido.ENTREGADO, 'Entrega completada exitosamente');
    } catch (error) {
      console.error('Error al registrar entrega:', error);
    }
  };

  // Filtrar pedidos según el filtro activo
  const pedidosFiltrados = misPedidos.filter(pedido => {
    switch (activeFilter) {
      case 'asignados':
        return pedido.estado === EstadoPedido.ASIGNADO;
      case 'retirados':
        return pedido.estado === EstadoPedido.PEDIDO_RETIRADO;
      case 'en_camino':
        return pedido.estado === EstadoPedido.EN_CAMINO;
      case 'entregados':
        return pedido.estado === EstadoPedido.ENTREGADO;
      default:
        return true; // 'todos'
    }
  });

  // Contadores por estado
  const contadores = {
    todos: misPedidos.length,
    asignados: misPedidos.filter(p => p.estado === EstadoPedido.ASIGNADO).length,
    retirados: misPedidos.filter(p => p.estado === EstadoPedido.PEDIDO_RETIRADO).length,
    en_camino: misPedidos.filter(p => p.estado === EstadoPedido.EN_CAMINO).length,
    entregados: misPedidos.filter(p => p.estado === EstadoPedido.ENTREGADO).length,
  };

  const filtros: { key: FilterType; label: string; icon: string }[] = [
    { key: 'todos', label: 'Todos', icon: '📋' },
    { key: 'asignados', label: 'Asignados', icon: '📦' },
    { key: 'retirados', label: 'Retirados', icon: '📋' },
    { key: 'en_camino', label: 'En Camino', icon: '📍' },
    { key: 'entregados', label: 'Entregados', icon: '✅' },
  ];

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
                🚚 Mis Entregas Activas
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
            <p className="text-gray-600">Cargando tus entregas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar entregas</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Reintentar
            </Button>
          </div>
        ) : misPedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes entregas activas
            </h3>
            <p className="text-gray-600 mb-6">
              Acepta pedidos desde la lista de disponibles para comenzar.
            </p>
            <Button 
              onClick={() => router.push('/pedidos/disponibles')}
              className="w-full max-w-xs"
            >
              Ver Pedidos Disponibles
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumen de entregas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-3">📊 Resumen de Entregas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{contadores.todos}</div>
                  <div className="text-xs text-gray-600">Total Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{contadores.entregados}</div>
                  <div className="text-xs text-gray-600">Completadas</div>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              <div className="flex space-x-1 overflow-x-auto">
                {filtros.map((filtro) => (
                  <button
                    key={filtro.key}
                    onClick={() => setActiveFilter(filtro.key)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === filtro.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{filtro.icon}</span>
                    <span>{filtro.label}</span>
                    <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {contadores[filtro.key]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de pedidos filtrados */}
            <div className="space-y-4">
              {pedidosFiltrados.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay entregas {filtros.find(f => f.key === activeFilter)?.label.toLowerCase()}
                  </h3>
                  <p className="text-gray-600">
                    {activeFilter === 'todos' 
                      ? 'No tienes entregas activas en este momento.'
                      : `No tienes entregas con estado "${filtros.find(f => f.key === activeFilter)?.label}".`
                    }
                  </p>
                </div>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <PedidoCard 
                      pedido={pedido}
                      onIniciarTrayecto={() => {
                        if (pedido.estado === EstadoPedido.ASIGNADO) {
                          handleRetirarPedido(pedido.id);
                        } else if (pedido.estado === EstadoPedido.PEDIDO_RETIRADO) {
                          handleIniciarTrayecto(pedido.id);
                        }
                      }}
                      onRegistrarEntrega={() => handleRegistrarEntrega(pedido.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Mis entregas activas</span>
            <span>Última actualización: {currentTime || 'Cargando...'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
