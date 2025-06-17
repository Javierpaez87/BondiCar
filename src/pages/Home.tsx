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
      {/* Hero Section - Verde y azul */}
      <section className="relative bg-gradient-to-br from-stone-800 via-teal-800 to-blue-900 text-emerald-50 py-16 md:py-24 overflow-hidden">
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
                {/* Overlay decorativo */}
                <div className="absolute -bottom-4 -right-4 bg-emerald-600 text-white p-3 rounded-lg shadow-lg">
                  <Compass className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Verde suave */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Trees className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
              ¿Por qué elegir BondiCar?
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Nacimos en Junín de los Andes para conectar a los viajeros de la Patagonia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-emerald-500">
              <div className="rounded-full bg-emerald-100 p-4 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <Car className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-stone-800 text-center">Ahorrá en tus viajes</h3>
              <p className="text-stone-600 text-center leading-relaxed">
                Compartí los gastos de nafta y peajes. En rutas largas como la 40, 
                el ahorro es significativo para todos.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
              <div className="rounded-full bg-blue-100 p-4 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-stone-800 text-center">Viajá con confianza</h3>
              <p className="text-stone-600 text-center leading-relaxed">
                Perfiles verificados y sistema de valoraciones. 
                La comunidad patagónica se cuida entre sí.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-teal-500">
              <div className="rounded-full bg-teal-100 p-4 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <Clock className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-stone-800 text-center">Flexible y conveniente</h3>
              <p className="text-stone-600 text-center leading-relaxed">
                Encontrá viajes que se adapten a tu horario. 
                Perfecto para trabajadores que van entre ciudades.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it Works Section - Azul oscuro */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-teal-800 to-blue-900 text-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-emerald-200 mb-8 max-w-2xl mx-auto">
              Simple como hacer dedo en la ruta, pero más seguro y organizado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-teal-800 p-8 rounded-xl border-2 border-emerald-500">
              <div className="bg-emerald-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-4 text-emerald-100">Buscá tu viaje</h3>
              <p className="text-emerald-200 leading-relaxed">
                Ingresá tu origen, destino y fecha. Encontrá viajes disponibles 
                en tu ruta patagónica.
              </p>
            </div>
            
            <div className="text-center bg-blue-800 p-8 rounded-xl border-2 border-blue-400">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-100">Reservá tu lugar</h3>
              <p className="text-blue-200 leading-relaxed">
                Elegí un viaje que te convenga y reservá tu asiento. 
                Coordiná los detalles con el conductor.
              </p>
            </div>
            
            <div className="text-center bg-teal-800 p-8 rounded-xl border-2 border-teal-400">
              <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-4 text-teal-100">¡Disfrutá el viaje!</h3>
              <p className="text-teal-200 leading-relaxed">
                Compartí la ruta, los gastos y quizás hagás nuevos amigos 
                en el camino.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Verde vibrante */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Mountain className="h-16 w-16 mx-auto mb-6 text-emerald-100" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Vamos? Te llevo!
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Únite a nuestra comunidad de viajeros patagónicos. Ahorrá dinero, 
            conocé gente y cuidemos juntos nuestros hermosos paisajes.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/create-trip')}
              className="bg-stone-800 hover:bg-stone-700 text-emerald-100 border-stone-700"
            >
              Publicar un Viaje
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-emerald-600"
              onClick={() => navigate('/search')}
            >
              Buscar Viajes
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - Verde claro */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-800">
            Lo que dicen nuestros viajeros
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-emerald-500">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Testimonio de Laura" 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-emerald-500"
                />
                <div>
                  <h4 className="font-bold text-stone-800">Laura M.</h4>
                  <p className="text-sm text-stone-600">Villa La Angostura</p>
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
                "Uso BondiCar para ir a trabajar a Bariloche. He conocido gente 
                increíble y ahorro una fortuna en combustible. ¡Recomendadísimo!"
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Testimonio de Martín" 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-500"
                />
                <div>
                  <h4 className="font-bold text-stone-800">Martín P.</h4>
                  <p className="text-sm text-stone-600">San Martín de los Andes</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-stone-600 italic leading-relaxed">
                "Como conductor, me ayuda a cubrir los gastos de mis viajes 
                frecuentes por la Ruta 40. La app es súper fácil de usar."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-teal-500">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" 
                  alt="Testimonio de Carolina" 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-teal-500"
                />
                <div>
                  <h4 className="font-bold text-stone-800">Carolina G.</h4>
                  <p className="text-sm text-stone-600">Junín de los Andes</p>
                  <div className="flex mt-1">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-teal-500 fill-current" viewBox="0 0 24 24">
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
                "Perfecta para los que vivimos en pueblos chicos y necesitamos 
                viajar a las ciudades. ¡Una solución genial para la Patagonia!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;