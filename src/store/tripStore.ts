import { create } from 'zustand';
import { Trip, Booking, TripFilters } from '../types';
import { getAuth } from 'firebase/auth';
import { 
  collection, getDocs, query, where, getFirestore, addDoc, serverTimestamp 
} from 'firebase/firestore';

interface TripState {
  trips: Trip[];
  myTrips: Trip[];
  myBookings: Booking[]; // Esto aún usa mockBookings si no tenés bookings en Firebase
  filteredTrips: Trip[];
  isLoading: boolean;
  error: string | null;
  
  fetchTrips: () => Promise<void>;
  fetchMyTrips: () => Promise<void>;
  fetchMyBookings: () => Promise<void>;
  createTrip: (tripData: Omit<Trip, 'id' | 'driverId' | 'driver' | 'status' | 'createdAt'>) => Promise<Trip>;
  filterTrips: (filters: TripFilters) => void;
  bookTrip: (tripId: string, seats: number) => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  myTrips: [],
  myBookings: [],
  filteredTrips: [],
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, 'Post Trips'));

      const trips: Trip[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        trips.push({
          id: doc.id,
          driverId: data.driverId,
          driver: {
            id: data.driverId,
            name: '', // Podés expandir si guardás más datos del conductor
            email: '',
            photoUrl: '',
          },
          origin: data.origin,
          destination: data.destination,
          departureDate: data.departureDate,
          availableSeats: data.availableSeats,
          price: data.price,
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate?.() || new Date(),
        });
      });

      set({ trips, filteredTrips: trips, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar viajes',
        isLoading: false,
      });
    }
  },

  fetchMyTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No estás autenticado');

      const db = getFirestore();
      const q = query(collection(db, 'Post Trips'), where('driverId', '==', user.uid));
      const snapshot = await getDocs(q);

      const myTrips: Trip[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        myTrips.push({
          id: doc.id,
          driverId: data.driverId,
          driver: {
            id: data.driverId,
            name: user.displayName || '',
            email: user.email || '',
            photoUrl: user.photoURL || '',
          },
          origin: data.origin,
          destination: data.destination,
          departureDate: data.departureDate,
          availableSeats: data.availableSeats,
          price: data.price,
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate?.() || new Date(),
        });
      });

      set({ myTrips, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar tus viajes',
        isLoading: false,
      });
    }
  },

  fetchMyBookings: async () => {
    // Mantenido igual por ahora
    set({ isLoading: false });
  },

  createTrip: async (tripData) => {
    set({ isLoading: true, error: null });
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error('No estás autenticado');

      const fullTrip = {
        ...tripData,
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
        status: 'active',
        createdAt: new Date(), // visual only
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
  },

  filterTrips: (filters) => {
    const { trips } = get();

    let filtered = [...trips];

    if (filters.origin) {
      filtered = filtered.filter(trip =>
        trip.origin.toLowerCase().includes(filters.origin!.toLowerCase())
      );
    }

    if (filters.destination) {
      filtered = filtered.filter(trip =>
        trip.destination.toLowerCase().includes(filters.destination!.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter(trip => {
        const tripDate = new Date(trip.departureDate);
        const filterDate = new Date(filters.date!);
        return (
          tripDate.getFullYear() === filterDate.getFullYear() &&
          tripDate.getMonth() === filterDate.getMonth() &&
          tripDate.getDate() === filterDate.getDate()
        );
      });
    }

    if (filters.minSeats) {
      filtered = filtered.filter(trip => trip.availableSeats >= filters.minSeats!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(trip => trip.price <= filters.maxPrice!);
    }

    set({ filteredTrips: filtered });
  },

  bookTrip: async (tripId, seats) => {
    // Simulado por ahora, sin conexión real a Firebase
    set({ isLoading: false });
  },
}));
