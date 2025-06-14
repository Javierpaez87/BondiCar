// 🔝 Esto debe estar al principio del archivo, con los demás imports
import { Timestamp } from 'firebase/firestore';
// Dentro del objeto pasado a create<TripState>
createTrip: async (tripData) => {
  set({ isLoading: true, error: null });

  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error('No estás autenticado');

    const fullTrip = {
      ...tripData,
      departureDate: Timestamp.fromDate(new Date(tripData.departureDate)), // ✅ conversión correcta
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
      departureDate: new Date(tripData.departureDate), // para la UI
      status: 'active',
      createdAt: new Date(), // solo visual
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

