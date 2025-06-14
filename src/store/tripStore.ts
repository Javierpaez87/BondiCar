import { create } from 'zustand';
import {
import { useNavigate } from 'react-router-dom';
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Trip } from '../types';

interface TripState {
  trips: Trip[];
  myTrips: Trip[];
  isLoading: boolean;
  error: string | null;
  createTrip: (tripData: any) => Promise<Trip>;
  fetchTrips: () => Promise<void>;
  fetchMyTrips: () => Promise<void>;
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

      set((state) => ({
        trips: [...state.trips, trip],
        myTrips: [...state.myTrips, trip],
        isLoading: false,
      }));

      return trip;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear viaje',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, 'Post Trips'));

      const trips: Trip[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          ...data,
          departureDate: data.departureDate?.toDate?.() || new Date(),
        };
      });

      set({ trips, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al obtener viajes',
        isLoading: false,
      });
    }
  },

  fetchMyTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No estás autenticado');

      const q = query(collection(db, 'Post Trips'), where('driverId', '==', user.uid));
      const snapshot = await getDocs(q);

      const myTrips: Trip[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          ...data,
          departureDate: data.departureDate?.toDate?.() || new Date(),
        };
      });

      set({ myTrips, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al obtener mis viajes',
        isLoading: false,
      });
    }
  },
}));
