import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Shield, Clock, MapPin, Mountain, Compass } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TripCard from '../components/trip/TripCard'; // 👈 nuevo
import { Trip } from '../types';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [recommendedTrips, setRecommendedTrips] = useState<Trip[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  };

  // 🔁 Trae viajes sugeridos al montar
  useEffect(() => {
    const fetchRecommendedTrips = async () => {
      try {
        const db = getFirestore();
        const tripsRef = collection(db, 'Post Trips');
        const q = query(tripsRef, orderBy('createdAt', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        const trips: Trip[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trip[];
        setRecommendedTrips(trips);
      } catch (error) {
        console.error('Error al traer viajes recomendados:', error);
      }
    };

    fetchRecommendedTrips();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-800 text-emerald-50 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="currentColor">
            <path d="M0 400 L200 200 L400 300 L600 150 L800 250 L1000 100 L1200 200 L1200 600 L0 600 Z" />
            <path d="M0 450 L150 300 L350 380 L550 250 L750 350 L950 200 L1200 300 L1200 600 L0 600 Z" opacity="0.7"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Mountain className="h-8 w-8 text-emerald-400 mr-3" />
                <span className="text-emerald-400 font-semibold text-lg">Patagonia</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 animate-slide-up text-shadow-lg">
                Juntos y al mismo lugar 
                <span className="text-emerald-400"> BondiCar</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Conectamos viajeros, ahorramos combustible, y hacemos amigos.
              </p>
              <form onSubmit={handleSearch} className="bg-stone-100 rounded-xl p-6 shadow-2xl animate-slide-up border-2 border-emerald-500" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    list="lugares"
                    placeholder="¿Desde dónde salís?"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    leftIcon={<MapPin className="h-5 w-5 text-emerald-600" />}
                    required
                    className="border-stone-300 focus:border-emerald-600 focus:ring-emerald-600"
                  />
                  <Input
                    list="lugares"
                    placeholder="¿A dónde vas?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    leftIcon={<MapPin className="h-5 w-5 text-emerald-600" />}
                    required
                    className="border-stone-300 focus:border-emerald-600 focus:ring-emerald-600"
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  icon={<Search className="h-5 w-5" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold border border-emerald-500"
                >
                  Buscar Viajes
                </Button>
              </form>
              <datalist id="lugares">
                <option value="Junín de los Andes" />
                <option value="San Martín de los Andes" />
                <option value="Bariloche" />
                <option value="Villa La Angostura" />
                <option value="Zapala" />
                <option value="Neuquén" />
                <option value="Esquel" />
                <option value="El Bolsón" />
                <option value="Trevelin" />
                <option value="La Pampa" />
              </datalist>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <img 
                  src="/sma dedo.png" 
                  alt="Viajero haciendo dedo en la Patagonia" 
                  className="rounded-xl shadow-2xl max-w-full h-auto animate-fade-in border-4 border-emerald-500"
                  style={{ maxHeight: '500px' }}
                />
                <div className="absolute -bottom-4 -right-4 bg-emerald-600 text-white p-3 rounded-lg shadow-lg">
                  <Compass className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚗 Viajes recomendados */}
      {recommendedTrips.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-slate-800">
              Viajes que pueden interesarte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🧍‍♂️ Testimonios */}
      {/* Aquí queda tu sección de testimonios sin cambios */}
    </Layout>
  );
};

export default Home;
