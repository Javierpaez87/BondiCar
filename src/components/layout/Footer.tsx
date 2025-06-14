import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Instagram, Twitter, Mountain, Trees } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 text-amber-50 py-12 border-t-4 border-amber-600">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="relative">
                {/* Montañas de fondo */}
                <svg className="h-10 w-12 text-stone-600 absolute -top-1 -left-1" viewBox="0 0 48 40" fill="currentColor">
                  <path d="M0 30 L12 15 L24 25 L36 10 L48 20 L48 40 L0 40 Z" opacity="0.6"/>
                  <path d="M0 35 L8 22 L16 28 L28 18 L40 25 L48 30 L48 40 L0 40 Z" opacity="0.4"/>
                </svg>
                {/* Auto principal */}
                <Car className="h-8 w-8 text-amber-500 relative z-10" />
              </div>
              <span className="text-xl font-bold">
                Bondi<span className="text-amber-400">Car</span>
              </span>
            </Link>
            <p className="text-amber-200 max-w-sm leading-relaxed mb-4">
              Conectamos viajeros patagónicos que recorren los mismos caminos. 
              Ahorrá en combustible y conocé gente increíble en el camino.
            </p>
            <div className="flex items-center text-amber-300">
              <Mountain className="h-5 w-5 mr-2" />
              <span className="text-sm">Desde Junín de los Andes</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-amber-100 flex items-center">
                <Trees className="h-5 w-5 mr-2" />
                Navegación
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                    Buscar Viajes
                  </Link>
                </li>
                <li>
                  <Link to="/create-trip" className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                    Publicar Viaje
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                    Mi Panel
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-amber-100">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms" className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-amber-200 hover:text-amber-400 transition-colors text-sm">
                    Preguntas Frecuentes
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-amber-100">Contacto</h3>
              <ul className="space-y-3">
                <li className="text-amber-200 text-sm">
                  <a href="mailto:info@bondicar.com" className="hover:text-amber-400 transition-colors">
                    info@bondicar.com
                  </a>
                </li>
                <li className="text-amber-200 text-sm">
                  <a href="tel:+542972491234" className="hover:text-amber-400 transition-colors">
                    +54 2972 49-1234
                  </a>
                </li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="text-amber-200 hover:text-amber-400 transition-colors p-2 bg-stone-700 rounded-full">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-amber-200 hover:text-amber-400 transition-colors p-2 bg-stone-700 rounded-full">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-amber-200 hover:text-amber-400 transition-colors p-2 bg-stone-700 rounded-full">
                    <Twitter className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-stone-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left text-amber-300 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BondiCar. Hecho con ❤️ en Junín de los Andes, Neuquén. 
              Todos los derechos reservados.
            </p>
            <div className="flex items-center text-amber-400 text-sm">
              <Mountain className="h-4 w-4 mr-1" />
              <span>Patagonia Argentina</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;