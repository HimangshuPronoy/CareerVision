
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl md:text-3xl font-bold gradient-text">CareerVision</span>
            </Link>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-6">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/features" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-careervision-600 dark:text-gray-300 dark:hover:text-white transition-colors">
              About
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-full shadow-md bg-gradient-to-r from-careervision-500 to-insight-500 hover:from-careervision-600 hover:to-insight-600 transition-all duration-300 hover:shadow-lg border-0">
                Sign Up
              </Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg" 
          id="mobile-menu"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              Home
            </Link>
            <Link to="/features" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
              About
            </Link>
          </div>
          <div className="pt-4 pb-6 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 space-y-3">
              <Link to="/login" className="block w-full px-4 py-3 text-center rounded-lg text-base font-medium text-gray-700 hover:text-careervision-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="block w-full px-4 py-3 text-center rounded-lg text-base font-medium bg-gradient-to-r from-careervision-500 to-insight-500 text-white hover:from-careervision-600 hover:to-insight-600 shadow-md transition-all duration-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
