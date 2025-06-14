import { create } from 'zustand';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  Timestamp,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Trip, Booking } from '../types';

interface TripState {
  trips: Trip[];
  myTrips: Trip[];
  myBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  createTrip: (tripData: any) => Promise<Trip>;
  fetchTrips: () => Promise<void>;
  fetchMyTrips: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  myTrips: [],
  myBookings: [],
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
        driver: {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: tripData.phone || '',
          profilePicture: user.photoURL || '',
        },
      };

      const docRef = await addDoc(collection(db, 'Post Trips'), fullTrip);

      const trip: Trip = {
        id: docRef.id,
        ...fullTrip,
        departureDate: new Date(tripData.departureDate),
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
          createdAt: data.createdAt?.toDate?.() || new Date(),
          driver: {
            ...data.driver,
            phone: data.driver?.phone || '',
            profilePicture: data.driver?.profilePicture || '',
          },
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
          createdAt: data.createdAt?.toDate?.() || new Date(),
          driver: {
            ...data.driver,
            phone: data.driver?.phone || '',
            profilePicture: data.driver?.profilePicture || '',
          },
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

  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No estás autenticado');

      const snapshot = await getDocs(query(collection(db, 'Bookings'), where('passengerId', '==', user.uid)));

      const myBookings: Booking[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const tripRef = doc(db, 'Post Trips', data.tripId);
          const tripSnap = await getDoc(tripRef);
          const tripData = tripSnap.exists() ? tripSnap.data() : null;

          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            trip: {
              id: data.tripId,
              ...tripData,
              departureDate: tripData?.departureDate?.toDate?.() || new Date(),
              createdAt: tripData?.createdAt?.toDate?.() || new Date(),
              driver: {
                ...tripData?.driver,
                phone: tripData?.driver?.phone || '',
                profilePicture: tripData?.driver?.profilePicture || '',
              },
            },
          } as Booking;
        })
      );

      set({ myBookings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al obtener mis reservas',
        isLoading: false,
      });
    }
  },
}));
