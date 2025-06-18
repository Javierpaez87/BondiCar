import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Shield, Clock, MapPin, Mountain, Trees, Compass } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  };

  return (
    <Layout>
      {/* Hero Section - Solo verdes */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-800 text-emerald-50 py-16 md:py-24 overflow-hidden">
        {/* Decoración de montañas de fondo */}
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

      {/* ...otras secciones aquí... */}

      {/* Testimonials Section - Verde claro */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">
            Lo que dicen nuestros viajeros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-emerald-500">
              <div className="flex items-center mb-6">
                <img 
                  src="/agustin-r.jpeg" 
                  alt="Testimonio de Agustín" 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-emerald-500"
                />
                <div>
                  <h4 className="font-bold text-stone-800">Agustín R.</h4>
                  <p className="text-sm text-stone-600">Bariloche</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-emerald-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-stone-600 italic leading-relaxed">
                "Uso BondiCar para moverme de Dina Huapi a Bari. He conocido gente increíble y ahorré una fortuna en combustible. ¡Recomendadísimo!"
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-teal-500">
              <div className="flex items-center mb-6">
                <img 
                  src="/Paz R.png" 
                  alt="Testimonio de Paz" 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-teal-500"
                />
                <div>
                  <h4 className="font-bold text-stone-800">Paz R.</h4>
                  <p className="text-sm text-stone-600">San Martín de los Andes</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-teal-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-stone-600 italic leading-relaxed">
                "La app es súper fácil de usar. Lo que más me gusta es poder reducir costos y hacer los viajes más lindos conociendo gente!"
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-lime-500">
              <div className="flex items-center mb-6">
                <img 
                  src="/Javier P.jpeg" 
                  alt="Testimonio de Javier" 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-lime-500"
                />
                <div>
                  <h4 className="font-bold text-stone-800">Javier P.</h4>
                  <p className="text-sm text-stone-600">Junín de los Andes</p>
                  <div className="flex mt-1">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-lime-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-stone-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-stone-600 italic leading-relaxed">
                "Perfecta para los que vivimos en pueblos chicos y necesitamos viajar a las ciudades. ¡Una solución genial para la Patagonia!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
