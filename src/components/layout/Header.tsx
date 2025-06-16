import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 sticky top-0 z-50 shadow-lg border-b-2 border-amber-600">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo con montañas */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="relative">
            <svg className="h-10 w-12 text-stone-600 absolute -top-1 -left-1" viewBox="0 0 48 40" fill="currentColor">
              <path d="M0 30 L12 15 L24 25 L36 10 L48 20 L48 40 L0 40 Z" opacity="0.6"/>
              <path d="M0 35 L8 22 L16 28 L28 18 L40 25 L48 30 L48 40 L0 40 Z" opacity="0.4"/>
            </svg>
            <Car className="h-8 w-8 text-amber-500 relative z-10" />
          </div>
          <span className="text-xl font-bold text-amber-100">
            Bondi<span className="text-amber-400">Car</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/search" 
            className={`text-sm font-medium hover:text-amber-400 transition-colors ${
              isActive('/search') ? 'text-amber-400' : 'text-stone-200'
            }`}
          >
            Buscar Viajes
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium hover:text-amber-400 transition-colors ${
                  isActive('/dashboard') ? 'text-amber-400' : 'text-stone-200'
                }`}
              >
                Mi Panel
              </Link>
              <Link 
                to="/create-trip" 
                className="px-4 py-2 bg-amber-600 text-stone-900 font-medium rounded-lg shadow-sm hover:bg-amber-500 transition-colors border border-amber-500"
              >
                Publicar Viaje
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-stone-600 flex items-center justify-center overflow-hidden border-2 border-amber-600">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-amber-400" />
                    )}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-stone-800 rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 border border-amber-600">
                  <Link to="/search" className="flex items-center px-4 py-2 text-sm text-stone-200 hover:bg-stone-700">
                    🔍 <span className="ml-2">Buscar Viajes</span>
                  </Link>
                  <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-stone-200 hover:bg-stone-700">
                    🧭 <span className="ml-2">Mi Panel</span>
                  </Link>
                  <Link to="/create-trip" className="flex items-center px-4 py-2 text-sm text-stone-200 hover:bg-stone-700">
                    🚗 <span className="ml-2">Publicar Viaje</span>
                  </Link>
                  <Link to="/dashboard?tab=profile" className="flex items-center px-4 py-2 text-sm text-stone-200 hover:bg-stone-700">
                    👤 <span className="ml-2">Mi Perfil</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-stone-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-stone-200 hover:text-amber-400 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-amber-600 text-stone-900 font-medium rounded-lg shadow-sm hover:bg-amber-500 transition-colors border border-amber-500"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-amber-100 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-800 border-t border-amber-600 animate-slide-down">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/search" 
                className="text-sm font-medium text-stone-200 hover:text-amber-400 transition-colors"
                onClick={closeMenu}
              >
                Buscar Viajes
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-stone-200 hover:text-amber-400 transition-colors"
                onClick={closeMenu}
              >
                Mi Panel
              </Link>
              <Link 
                to="/create-trip" 
                className="px-4 py-2 bg-amber-600 text-stone-900 font-medium rounded-lg shadow-sm hover:bg-amber-500 transition-colors text-center border border-amber-500"
                onClick={closeMenu}
              >
                Publicar Viaje
              </Link>
              <Link 
                to="/dashboard?tab=profile" 
                className="text-sm font-medium text-stone-200 hover:text-amber-400 transition-colors"
                onClick={closeMenu}
              >
                👤 Mi Perfil
              </Link>
              <button 
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
