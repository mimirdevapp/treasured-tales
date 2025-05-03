import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin } from 'lucide-react';
import Logo from '../assets/footerlogo.jpg'

const Footer = () => {
  return (
    <footer className="bg-[#E8E2D4] py-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <img src={Logo} alt="Logo" className="object-contain h-28" />
          </div>
          <div className="flex justify-center items-center space-x-2 text-gray-600">
            <MapPin className="text-[#8C5117] h-5 w-5" />
            <span className="font-cormorant text-[#8C5117] text-xl">Mumbai, India</span>
          </div>
          <div className="flex justify-center items-center space-x-2 md:justify-end">
            <a
              href="https://www.instagram.com/thetreasuredtales.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8C5117] hover:text-gray-900 transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;