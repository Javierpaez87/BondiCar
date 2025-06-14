import React from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Users, DollarSign, Car } from 'lucide-react';
import { Trip } from '../../types';
import Button from '../ui/Button';

interface TripCardProps {
  trip: Trip;
  onBook?: (trip: Trip) => void;
  isReserved?: boolean;
  reservationStatus?: string;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onBook,
  isReserved = false,
  reservationStatus
}) => {
  const formattedDate = format(new Date(trip.departureDate), 'dd/MM/yyyy');
  
  const statusBadge = () => {
    if (!isReserved) return null;
    
    const badgeStyles = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    
    const status = reservationStatus || 'pending';
    const badgeStyle = badgeStyles[status as keyof typeof badgeStyles] || badgeStyles.pending;
    
    return (
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${badgeStyle}`}>
        {status === 'pending' && 'Pendiente'}
        {status === 'confirmed' && 'Confirmado'}
        {status === 'rejected' && 'Rechazado'}
        {status === 'cancelled' && 'Cancelado'}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow p-4 relative">
      {statusBadge()}
      
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            {trip.driver.profilePicture ? (
              <img 
                src={trip.driver.profilePicture} 
                alt={trip.driver.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-500 font-medium">
                  {trip.driver.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {trip.origin} → {trip.destination}
          </h3>
          
          <p className="text-sm text-gray-500 mt-1">
            Conductor: {trip.driver.name}
          </p>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-primary-500 mr-1" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 text-primary-500 mr-1" />
              <span>{trip.departureTime}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 text-primary-500 mr-1" />
              <span>{trip.availableSeats} {trip.availableSeats === 1 ? 'asiento' : 'asientos'}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-primary-500 mr-1" />
              <span>${trip.price}</span>
            </div>
          </div>
          
          {trip.carModel && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Car className="h-4 w-4 text-primary-500 mr-1" />
              <span>{trip.carModel} • {trip.carColor}</span>
            </div>
          )}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
  <div className="flex space-x-2">
    <div className="flex items-center text-sm">
      <MapPin className="h-4 w-4 text-primary-500 mr-1" />
      <span className="text-gray-600">{trip.origin}</span>
    </div>
    <span className="text-gray-400">→</span>
    <div className="flex items-center text-sm">
      <MapPin className="h-4 w-4 text-primary-500 mr-1" />
      <span className="text-gray-600">{trip.destination}</span>
    </div>
  </div>

  <div className="flex space-x-3">
    {trip.phone && (
      <a 
        href={`https://wa.me/${trip.phone.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 transition"
      >
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-... (recortado por brevedad) ..." />
        </svg>
        WhatsApp
      </a>
    )}

    {!isReserved && onBook && (
      <Button 
        variant="primary" 
        size="sm"
        onClick={() => onBook(trip)}
      >
        Reservar
      </Button>
    )}
  </div>
</div>

          
        </div>
      </div>
    </div>
  );
};

export default TripCard;
