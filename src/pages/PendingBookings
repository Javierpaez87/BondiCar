import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Booking } from '../types';

const PendingBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingBookings = async () => {
    setLoading(true);
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    // Traer los viajes del conductor
    const tripsSnapshot = await getDocs(
      query(collection(db, 'Post Trips'), where('driverId', '==', user.uid))
    );

    const tripIds = tripsSnapshot.docs.map((doc) => doc.id);

    if (tripIds.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }

    // Traer reservas que correspondan a esos viajes y estén en estado "pending"
    const bookingsSnapshot = await getDocs(
      query(collection(db, 'Bookings'), where('status', '==', 'pending'))
    );

    const matchingBookings: Booking[] = [];

    for (const docSnap of bookingsSnapshot.docs) {
      const data = docSnap.data();
      if (tripIds.includes(data.tripId)) {
        matchingBookings.push({
          id: docSnap.id,
          ...data,
        } as Booking);
      }
    }

    setBookings(matchingBookings);
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: 'accepted' | 'rejected') => {
    const db = getFirestore();
    await updateDoc(doc(db, 'Bookings', bookingId), { status });
    await fetchPendingBookings(); // actualizar la lista
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Reservas pendientes</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : bookings.length === 0 ? (
        <p>No hay reservas pendientes.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p><strong>Viaje ID:</strong> {booking.tripId}</p>
                <p><strong>Asientos solicitados:</strong> {booking.seats}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateBookingStatus(booking.id, 'accepted')}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => updateBookingStatus(booking.id, 'rejected')}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingBookings;
