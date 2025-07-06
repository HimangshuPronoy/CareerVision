
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-lg py-3 border-b border-slate-200/50' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CV</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">CareerVision</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Features
            </a>
            <a href="#insights" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Insights
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors font-medium">
              Pricing
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-600" />
            ) : (
              <Menu className="h-6 w-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-slate-200/50">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors font-medium px-2 py-1">
                Features
              </a>
              <a href="#insights" className="text-slate-600 hover:text-slate-800 transition-colors font-medium px-2 py-1">
                Insights
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors font-medium px-2 py-1">
                Pricing
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200/50">
                <Link to="/auth">
                  <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
