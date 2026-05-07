'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock authentication - en producción conectar con API real
      if (email === 'repartidor@mail.cl' && password === '123456') {
        // Guardar sesión mock
        localStorage.setItem('repartidor_token', 'mock-token-12345');
        localStorage.setItem('repartidor_datos', JSON.stringify({
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '+56 9 1234 5678',
          email: 'repartidor@mail.cl',
          rut: '12.345.678-9'
        }));
        
        // Redirigir al dashboard
        router.push('/');
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">🚚</div>
          <h1 className="text-2xl font-bold text-gray-900">PymeTrack Repartidor</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para comenzar
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[48px]"
                  placeholder="repartidor@mail.cl"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[48px]"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                loading={loading}
                disabled={!email || !password}
                className="w-full"
                size="lg"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>

          {/* Demo Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">🔍 Datos de Demo</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Email:</strong> repartidor@mail.cl</p>
              <p><strong>Contraseña:</strong> 123456</p>
            </div>
          </div>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ¿Tienes problemas para iniciar sesión?
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contacta a tu supervisor o soporte técnico
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
