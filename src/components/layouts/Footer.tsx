
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <span className="text-2xl font-bold gradient-text mb-2">CareerVision</span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Data-driven insights for your career growth
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-careervision-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-base text-gray-600 hover:text-careervision-600 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-careervision-600 dark:hover:text-careervision-400 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-careervision-600 dark:hover:text-careervision-400 transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-careervision-600 dark:hover:text-careervision-400 transition-colors">
              Contact
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-500 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} CareerVision. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
