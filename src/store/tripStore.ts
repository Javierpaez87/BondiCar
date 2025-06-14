import { create } from 'zustand';
import { getFirestore, collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Trip } from '../types';

interface TripState {
  trips: Trip[];
  myTrips: Trip[];
  isLoading: boolean;
  error: string | null;
  createTrip: (tripData: any) => Promise<Trip>;
  // Podés sumar acá otros métodos luego como fetchTrips, bookTrip, etc.
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  myTrips: [],
  isLoading: false,
  error: null,

  createTrip: async (tripData) => {
    set({ isLoading: true, error: null });

    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error('No estás autenticado');

      const fullTrip = {
        ...tripData,
        departureDate: Timestamp.fromDate(new Date(tripData.departureDate)),
        driverId: user.uid,
        status: 'active',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'Post Trips'), fullTrip);

      const trip: Trip = {
        id: docRef.id,
        driverId: user.uid,
        driver: {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          photoUrl: user.photoURL || '',
        },
        ...tripData,
        departureDate: new Date(tripData.departureDate),
        status: 'active',
        createdAt: new Date(),
      };

      const updatedTrips = [...get().trips, trip];
      const updatedMyTrips = [...get().myTrips, trip];

      set({
        trips: updatedTrips,
        myTrips: updatedMyTrips,
        isLoading: false,
      });

      return trip;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear viaje',
        isLoading: false,
      });
      throw error;
    }
  }
}));

