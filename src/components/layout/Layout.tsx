import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../store/authStore';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [hasPendingBookings, setHasPendingBookings] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<'accepted' | 'rejected' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const db = getFirestore();

    const fetchNotifications = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // Conductor: check for pending bookings
        const tripsSnapshot = await getDocs(
          query(collection(db, 'Post Trips'), where('driverId', '==', user.uid))
        );

        const tripIds = tripsSnapshot.docs.map((doc) => doc.id);

        if (tripIds.length > 0) {
          const bookingsSnapshot = await getDocs(
            query(
              collection(db, 'Bookings'),
              where('tripId', 'in', tripIds),
              where('status', '==', 'pending')
            )
          );

          if (!bookingsSnapshot.empty) {
            setHasPendingBookings(true);
          }
        }

        // Pasajero: check for accepted or rejected bookings
        const passengerSnapshot = await getDocs(
          query(
            collection(db, 'Bookings'),
            where('passengerId', '==', user.uid),
            where('status', 'in', ['accepted', 'rejected'])
          )
        );

        if (!passengerSnapshot.empty) {
          const booking = passengerSnapshot.docs[0];
          const status = booking.data().status;
          if (status === 'accepted' || status === 'rejected') {
            setReservationStatus(status);
          }
        }
      } catch (error) {
        console.error('Error al verificar notificaciones:', error);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

     {/* Notificación para conductor */}
{hasPendingBookings && (
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 flex justify-between items-center px-6">
    <div>
      🔔 Tienes nuevas reservas pendientes para tus viajes publicados.
    </div>
    <button
      onClick={() => {
        navigate('/dashboard');
        localStorage.setItem('dashboardTab', 'received'); // Guardamos tab para ir a 'Reservas recibidas'
      }}
      className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-yellow-300 hover:bg-yellow-400 text-yellow-900"
    >
      Ver reservas
    </button>
  </div>
)}
      {/* Notificación para pasajero */}
      {reservationStatus === 'accepted' && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 text-center">
          ✅ Tu reserva fue aceptada.{' '}
          <button
            onClick={() => navigate('/dashboard')}
            className="underline font-semibold"
          >
            Ver detalles
          </button>
        </div>
      )}

      {reservationStatus === 'rejected' && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 text-center">
          ❌ Tu reserva fue rechazada.{' '}
          <button
            onClick={() => navigate('/dashboard')}
            className="underline font-semibold"
          >
            Ver detalles
          </button>
        </div>
      )}

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
