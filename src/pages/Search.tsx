import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TripFilter from '../components/trip/TripFilter';
import TripCard from '../components/trip/TripCard';
import BookingModal from '../components/trip/BookingModal';
import { useTripStore } from '../store/tripStore';
import { Trip, TripFilters } from '../types';
import { useAuthStore } from '../store/authStore';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { trips, filteredTrips, isLoading, error, fetchTrips, filterTrips, bookTrip } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);
  
  useEffect(() => {
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    
    if (origin || destination) {
      const initialFilters: TripFilters = {
        origin: origin || undefined,
        destination: destination || undefined,
      };
      
      filterTrips(initialFilters);
    }
  }, [searchParams, filterTrips]);
  
  const handleFilter = (filters: TripFilters) => {
    filterTrips(filters);
  };
  
  const handleBookTrip = (trip: Trip) => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    setSelectedTrip(trip);
  };
  
  const handleConfirmBooking = async (tripId: string, seats: number) => {
    await bookTrip(tripId, seats);
    setSelectedTrip(null);
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Buscar Viajes
          </h1>
          
          <TripFilter onFilter={handleFilter} />
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? 'Cargando viajes...' : `${filteredTrips.length} viajes encontrados`}
            </h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onBook={handleBookTrip}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron viajes</h3>
                  <p className="text-gray-600">
                    Intenta con otros filtros o crea un nuevo viaje.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {selectedTrip && (
        <BookingModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </Layout>
  );
};

export default Search;