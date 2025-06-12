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
          
          <div className="mt-4 flex justify-between items-center">
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
            
            {!isReserved && onBook && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => onBook(trip)}
              >
                Reservar
              </Button>
            )}
            
            {isReserved && (
              <a 
                href={`https://wa.me/${trip.driver.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;