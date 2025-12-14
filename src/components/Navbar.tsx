import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";

function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Determine text color based on current page
  const textColorClass = isHomePage ? "text-white" : "text-black";

  // Check if screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Handle smart scroll behavior
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 200) {
        // Scrolling down & past threshold - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up or at top - show navbar
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking a link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClickWhatsApp = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };
  const handleClickInsta = () => {
    window.open('https://www.instagram.com/thetreasuredtales.in/', '_blank');
  };
  return (
    <>
      <nav className={`absolute top-0 left-0 w-full z-50 ${textColorClass} font-sans tracking-wide`}>
        {/* Mobile Navigation */}
        {isMobile ? (
          <div className="flex justify-between items-center py-5 px-4">
             {/* Logo always centered with consistent layout */}

             <div className="w-6">

{/* Empty div with same width as hamburger to ensure centering */}

</div>
            <div className="flex-1 flex justify-center">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className={`object-contain h-16 transition-all ${!isHomePage ? "filter invert" : ""}`}
                />
              </Link>
            </div>

            {/* Hamburger icon on right */}
            <button
              onClick={toggleMenu}
              className="focus:outline-none w-6"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col justify-between h-5">
                <span className={`h-0.5 w-full bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`h-0.5 w-full bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        ) : (
          /* Desktop Navigation - Keep original design */
          <div className="flex justify-center items-center pb-6 text-sm italic uppercase space-x-10 py-5">
            {/* Left Nav */}
            <div className="flex space-x-20">
              <Link to="/" className="nav-link font-cormorant hover:opacity-75">Home</Link>
              <Link to="/gallery" className="nav-link font-cormorant hover:opacity-75">Gallery</Link>
              <Link to="/#featured-section" className="nav-link font-cormorant hover:opacity-75">Treasured Moments</Link>
            </div>

            <div className="px-16">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Logo"
                  className={`object-contain h-24 ${!isHomePage ? "filter invert" : ""}`}
                />
              </Link>
            </div>

            {/* Right Nav */}
            <div className="flex space-x-20">
              <Link to="/#testimonials-section" className="nav-link font-cormorant hover:opacity-75">Testimonials</Link>
              <Link to="/#about-section" className="nav-link font-cormorant hover:opacity-75">About</Link>
              <Link to="/contact" className="nav-link font-cormorant hover:opacity-75">Contact</Link>
            </div>
          </div>
        )}

        {/* Mobile sidebar menu - slides from right */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-[#F8F4F0] shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}
        >
          <div className="p-6 flex flex-col space-y-8">
            <div className="flex justify-end">
              <button
                onClick={toggleMenu}
                className="text-black focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* MENU heading with divider */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold text-[#8C5117] mb-6 font-cormorant [letter-spacing:0.3em]">MENU</h1>
              <div className="w-12 h-px bg-gray-400"></div>
            </div>

            <div className="flex flex-col space-y-8">
              <Link
                to="/"
                className="text-black text-2xl font-cormorant hover:text-gray-600 transition-colors text-center"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/gallery"
                className="text-black text-2xl font-cormorant hover:text-gray-600 transition-colors text-center"
                onClick={closeMenu}
              >
                Gallery
              </Link>
              <Link
                to="/#featured-section"
                className="text-black text-2xl font-cormorant hover:text-gray-600 transition-colors text-center"
                onClick={closeMenu}
              >
                Featured
              </Link>
              <Link
                to="/#testimonials-section"
                className="text-black text-2xl font-cormorant hover:text-gray-600 transition-colors text-center"
                onClick={closeMenu}
              >
                Testimonials
              </Link>
              <Link
                to="/#about-section"
                className="text-black text-2xl font-cormorant hover:text-gray-600 transition-colors text-center"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-black text-2xl font-cormorant hover:text-gray-600 transition-colors text-center"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </div>

            {/* Divider after links */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-px bg-gray-400"></div>
            </div>


            {/* Social Media Icons */}
            <div className="flex justify-center space-x-8">
              {/* Instagram Icon - Using Font Awesome */}
              <button onClick={handleClickWhatsApp}><FaWhatsapp className="text-[#8C5117] hover:opacity-75 transition-opacity h-6 w-6" /></button>
              <button onClick={handleClickInsta}><FaInstagram className="text-[#8C5117] hover:opacity-75 transition-opacity h-6 w-6" /></button>
            </div>
          </div>
        </div>

        {/* Overlay for when menu is open */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMenu}
          ></div>
        )}

        <style jsx="true">{`
          /* Nav Link Underline Animation */
          .nav-link {
            position: relative;
            display: inline-block;
            padding: 4px 0;
          }
          
          .nav-link::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 1px;
            bottom: 0;
            left: 0;
            background-color: currentColor;
            transform-origin: bottom right;
            transition: transform 0.3s ease-out;
          }
          
          .nav-link:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
        `}</style>
      </nav>

      {/* Spacer for non-homepage pages */}
      {!isHomePage && <div className="w-full h-16 hidden md:block" />}
    </>
  );
}

export default Navbar;