import { create } from 'zustand';
import { Trip, Booking, TripFilters } from '../types';
import { mockTrips, mockBookings, currentUser } from '../utils/mockData';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface TripState {
  trips: Trip[];
  myTrips: Trip[];
  myBookings: Booking[];
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
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set trips from mock data
      set({ 
        trips: mockTrips,
        filteredTrips: mockTrips,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar viajes', 
        isLoading: false 
      });
    }
  },
  
  fetchMyTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get trips created by the current user
      const userTrips = mockTrips.filter(trip => trip.driverId === currentUser.id);
      
      set({ 
        myTrips: userTrips,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar tus viajes', 
        isLoading: false 
      });
    }
  },
  
  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get bookings made by the current user
      const userBookings = mockBookings.filter(booking => booking.passengerId === currentUser.id);
      
      set({ 
        myBookings: userBookings,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar tus reservas', 
        isLoading: false 
      });
    }
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
      createdAt: new Date(), // solo visual, no es igual a serverTimestamp
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
    
    // Apply filters
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
    set({ isLoading: true, error: null });
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Find the trip
      const trip = get().trips.find(t => t.id === tripId);
      if (!trip) {
        throw new Error('Viaje no encontrado');
      }
      
      // Check if enough seats are available
      if (trip.availableSeats < seats) {
        throw new Error('No hay suficientes asientos disponibles');
      }
      
      // Create booking
      const newBooking: Booking = {
        id: `${mockBookings.length + 1}`,
        tripId,
        trip,
        passengerId: currentUser.id,
        passenger: currentUser,
        seats,
        status: 'pending',
        createdAt: new Date(),
      };
      
      // Update available seats (in a real app, this would be an atomic transaction)
      const updatedTrips = get().trips.map(t => {
        if (t.id === tripId) {
          return {
            ...t,
            availableSeats: t.availableSeats - seats,
          };
        }
        return t;
      });
      
      // Add booking to my bookings
      const updatedMyBookings = [...get().myBookings, newBooking];
      
      set({ 
        trips: updatedTrips,
        filteredTrips: updatedTrips,
        myBookings: updatedMyBookings,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al reservar viaje', 
        isLoading: false 
      });
      throw error;
    }
  },
}));
