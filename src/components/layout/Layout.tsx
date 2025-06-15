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
import { X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [hasPendingBookings, setHasPendingBookings] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<'accepted' | 'rejected' | null>(null);
  const [hidePendingNotice, setHidePendingNotice] = useState(false);
  const [hideStatusNotice, setHideStatusNotice] = useState(false);
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

        if (tripIds.length > 0 && tripIds.length <= 10) {
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

  // Ocultar automáticamente notificación de pasajero tras 8s
  useEffect(() => {
    if (reservationStatus) {
      const timeout = setTimeout(() => setHideStatusNotice(true), 8000);
      return () => clearTimeout(timeout);
    }
  }, [reservationStatus]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* 🔔 Notificación conductor */}
      {hasPendingBookings && !hidePendingNotice && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 flex justify-between items-center relative">
          <div className="flex-1">
            🔔 Tienes nuevas reservas pendientes para tus viajes publicados.
          </div>
          <button
            onClick={() => {
              navigate('/dashboard');
              localStorage.setItem('dashboardTab', 'received');
            }}
            className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-yellow-300 hover:bg-yellow-400 text-yellow-900"
          >
            Ver reservas
          </button>
          <button
            onClick={() => setHidePendingNotice(true)}
            className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ✅ Notificación pasajero */}
      {reservationStatus && !hideStatusNotice && (
        <div
          className={`px-4 py-3 text-center border flex items-center justify-center gap-2 relative ${
            reservationStatus === 'accepted'
              ? 'bg-green-100 border-green-400 text-green-800'
              : 'bg-red-100 border-red-400 text-red-800'
          }`}
        >
          {reservationStatus === 'accepted'
            ? '✅ Tu reserva fue aceptada.'
            : '❌ Tu reserva fue rechazada.'}

          <button
            onClick={() => navigate('/dashboard')}
            className="underline font-semibold"
          >
            Ver detalles
          </button>

          <button
            onClick={() => setHideStatusNotice(true)}
            className="absolute top-2 right-2 text-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
