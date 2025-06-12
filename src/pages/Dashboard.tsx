import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Car, Bookmark, User } from 'lucide-react';
import Layout from '../components/layout/Layout';
import TripCard from '../components/trip/TripCard';
import { useTripStore } from '../store/tripStore';
import { useAuthStore } from '../store/authStore';
import { Booking } from '../types';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { myTrips, myBookings, isLoading, error, fetchMyTrips, fetchMyBookings } = useTripStore();
  const [activeTab, setActiveTab] = useState<'trips' | 'bookings' | 'profile'>('trips');
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyTrips();
      fetchMyBookings();
    }
  }, [isAuthenticated, fetchMyTrips, fetchMyBookings]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const getReservationStatus = (booking: Booking) => {
    return booking.status;
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Mi Panel
          </h1>
          
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('trips')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'trips'
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Car className="inline-block h-5 w-5 mr-2" />
                  Mis Viajes Publicados
                </button>
                
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Bookmark className="inline-block h-5 w-5 mr-2" />
                  Mis Reservas
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="inline-block h-5 w-5 mr-2" />
                  Mi Perfil
                </button>
              </nav>
            </div>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'trips' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Viajes que has publicado
                  </h2>
                  
                  {myTrips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-card p-8 text-center">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No has publicado ningún viaje
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Comienza a publicar viajes y conecta con pasajeros que quieren ir a tu mismo destino.
                      </p>
                      <a
                        href="/create-trip"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
                      >
                        Publicar un Viaje
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Viajes que has reservado
                  </h2>
                  
                  {myBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myBookings.map((booking) => (
                        <TripCard 
                          key={booking.id} 
                          trip={booking.trip} 
                          isReserved={true}
                          reservationStatus={getReservationStatus(booking)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-card p-8 text-center">
                      <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No has reservado ningún viaje
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Busca y reserva viajes para comenzar a disfrutar de los beneficios de viajar compartido.
                      </p>
                      <a
                        href="/search"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
                      >
                        Buscar Viajes
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'profile' && (
                <div className="bg-white rounded-lg shadow-card p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                      <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {user?.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Información Personal
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                          <p className="text-base text-gray-900">{user?.name}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Correo electrónico</h3>
                          <p className="text-base text-gray-900">{user?.email}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                          <p className="text-base text-gray-900">{user?.phone}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Miembro desde</h3>
                          <p className="text-base text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <a
                          href="#"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Editar Perfil
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;