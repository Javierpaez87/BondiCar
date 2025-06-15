import { create } from 'zustand';
import {
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
import { Trip, Booking, TripFilters } from '../types';

interface TripState {
  trips: Trip[];
  myTrips: Trip[];
  myBookings: Booking[];
  filteredTrips: Trip[];
  isLoading: boolean;
  error: string | null;
  createTrip: (tripData: any) => Promise<Trip>;
  fetchTrips: () => Promise<void>;
  fetchMyTrips: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
  filterTrips: (filters: TripFilters) => void;
  bookTrip: (tripId: string) => Promise<void>; // ✅ SOLO FIRMA AQUÍ
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  myTrips: [],
  myBookings: [],
  filteredTrips: [],
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
        filteredTrips: [...state.filteredTrips, trip],
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

      set({ trips, filteredTrips: trips, isLoading: false });
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

        const driver = data.driver ?? {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          profilePicture: '',
          createdAt: new Date(),
        };

        return {
          id: doc.id,
          ...data,
          departureDate: data.departureDate?.toDate?.() || new Date(),
          createdAt: data.createdAt?.toDate?.() || new Date(),
          driver,
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

      const q = query(collection(db, 'Bookings'), where('passengerId', '==', user.uid));
      const snapshot = await getDocs(q);

      const bookings: Booking[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data() as DocumentData;

        const tripSnap = await getDocs(query(
          collection(db, 'Post Trips'),
          where('__name__', '==', data.tripId)
        ));

        const tripDoc = tripSnap.docs[0];
        const tripData = tripDoc?.data();

        if (tripData) {
          const booking: Booking = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            trip: {
              id: tripDoc.id,
              ...tripData,
              departureDate: tripData.departureDate?.toDate?.() || new Date(),
              createdAt: tripData.createdAt?.toDate?.() || new Date(),
              driver: {
                ...tripData.driver,
                phone: tripData.driver?.phone || '',
                profilePicture: tripData.driver?.profilePicture || '',
              },
            },
          };
          bookings.push(booking);
        }
      }

      set({ myBookings: bookings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al obtener reservas',
        isLoading: false,
      });
    }
  },

  filterTrips: (filters: TripFilters) => {
    const allTrips = get().trips;
    const filtered = allTrips.filter((trip) => {
      const matchesOrigin = filters.origin
        ? trip.origin.toLowerCase().includes(filters.origin.toLowerCase())
        : true;
      const matchesDestination = filters.destination
        ? trip.destination.toLowerCase().includes(filters.destination.toLowerCase())
        : true;
      return matchesOrigin && matchesDestination;
    });
    set({ filteredTrips: filtered });
  },

  bookTrip: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No estás autenticado');

      const bookingData = {
        tripId,
        passengerId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'Bookings'), bookingData);

      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al reservar viaje',
        isLoading: false,
      });
      throw error;
    }
  },
}));
