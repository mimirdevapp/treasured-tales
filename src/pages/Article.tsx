import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";

// Images
import dslr1 from '../assets/dslr(1).heic';
import dslr2 from '../assets/dslr(2).heic';
import dslr3 from '../assets/dslr(3).heic';
import dslr4 from '../assets/dslr(4).heic';
import dslr5 from '../assets/dslr(5).heic';
import dslr6 from '../assets/dslr(6).heic';
import dslr7 from '../assets/dslr(7).heic';
import dslr8 from '../assets/dslr(8).jpg';
import dslr9 from '../assets/dslr(9).jpg';
import dslr10 from '../assets/dslr(10).jpg';
import dslr13 from '../assets/dslr13.jpg';
import dslr14 from '../assets/dslr14.jpg';
import dslr15 from '../assets/dslr15.jpg';
import dslr16 from '../assets/dslr16.jpg';
import dslr20 from '../assets/dslr20.jpg';
import dslr99 from '../assets/dslr99.heic';
import hero from '../assets/hero.heic';

export default function Article({
  images = [],
  title: defaultTitle = "Gauthum & Meghana",
  subtitle: defaultSubtitle = "Dancing to the rhythm of love, surrounded by those who matter most. Gautham & Meghana's Sangeet was a night to remember.",
  category: defaultCategory = "Wedding",
  date: defaultDate = "12/06/24"
}) {
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFading, setModalFading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const scrollRevealSections = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef(null);

  const title = location.state?.title || defaultTitle;
  const subtitle = location.state?.subtitle || defaultSubtitle;
  const category = location.state?.category || defaultCategory;
  const date = location.state?.date || defaultDate;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Store original elements for restoration if needed
    const revealElements = [];
    
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add('revealed');
          });
          revealObserver.unobserve(entry.target);
        }
      });
    }, options);

    // Immediately reveal all elements if we're returning from a modal
    if (sessionStorage.getItem('modalWasOpened') === 'true') {
      document.querySelectorAll('.scroll-reveal').forEach(section => {
        section.classList.add('revealed');
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      });
      sessionStorage.removeItem('modalWasOpened');
    } else {
      const sections = document.querySelectorAll('.scroll-reveal');
      sections.forEach(section => {
        revealObserver.observe(section);
        revealElements.push(section);
      });
    }
    
    // Update ref for cleanup
    scrollRevealSections.current = revealElements;

    return () => {
      scrollRevealSections.current.forEach(section => {
        if (section) revealObserver.unobserve(section);
      });
    };
  }, []);

  const fallbackImages = [
    dslr1, dslr2, dslr3, dslr4, dslr5, dslr6, dslr7,
    dslr8, dslr9, dslr10, dslr13, dslr14, dslr15,
    dslr16, dslr20, dslr99
  ];

  const galleryImages = images.length > 0 ? images : fallbackImages;

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
    setModalFading(false);
  };

  const closeModal = () => {
    setModalFading(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalFading(false);
      
      // Force all scroll-reveal elements to be visible regardless of their current state
      document.querySelectorAll('.scroll-reveal').forEach(element => {
        element.classList.add('revealed');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    }, 300);
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKey);
      // Mark that a modal was opened for next render cycle
      sessionStorage.setItem('modalWasOpened', 'true');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const ImageWithHover = ({ src, alt = "Gallery image", delay = 0, isMobile }) => {
    // Check if modal was previously opened to prevent animation delay
    const wasModalOpened = sessionStorage.getItem('modalWasOpened') === 'true';
    
    return (
      <div
        className={`relative group cursor-pointer overflow-hidden scroll-reveal ${wasModalOpened ? 'revealed' : 'opacity-0 transform translate-y-4'} transition-all duration-500 ease-out min-h-44`}
        style={wasModalOpened ? {} : { transitionDelay: `${delay}ms` }}
        onClick={() => openModal(src)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {!isMobile && (
          <div className="absolute inset-0 bg-black/30 md:opacity-0 opacity-30 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-xs md:text-sm tracking-widest font-montserrat border-b border-white pb-1">VIEW</span>
          </div>
        )}
      </div>
    );
  };

  const renderGalleryGrid = () => {
    if (galleryImages.length === 0) return null;

    const heroImage = (
      <div className="w-full mb-4 relative scroll-reveal opacity-0 transition-all duration-500 ease-out transform translate-y-4">
        <img src={hero} alt="Gallery hero" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 flex flex-col bg-black bg-opacity-10 text-white px-4 sm:px-8 md:px-16 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-28 justify-center">
          <h1 className="text-[10px] sm:text-base md:text-lg font-cormorant mb-2 md:mb-4 [letter-spacing:0.2em] md:[letter-spacing:0.3em] uppercase">{category} - <span className="font-agraham">{date}</span></h1>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-agraham mb-3 sm:mb-4 md:mb-6 uppercase">{title}</h1>
          <div className="w-10 md:w-15 lg:w-20 h-[1px] bg-white mb-4 lg:mb-6"></div>
          <p className="text-xs lg:text-xl max-w-[70%] sm:max-w-full md:max-w-xl font-cormorant">{subtitle}</p>
        </div>
      </div>
    );

    if (galleryImages.length === 1) return heroImage;

    const imageGrid = [];

    imageGrid.push(
      <div key="row-1" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <ImageWithHover src={galleryImages[1]} delay={100} isMobile={isMobile} />
        {galleryImages[2] && <ImageWithHover src={galleryImages[2]} delay={200} isMobile={isMobile} />}
      </div>
    );

    if (galleryImages.length > 3) {
      imageGrid.push(
        <div key="row-2" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <ImageWithHover src={galleryImages[3]} delay={300} isMobile={isMobile} />
          {galleryImages[4] && <ImageWithHover src={galleryImages[4]} delay={400} isMobile={isMobile} />}
          {galleryImages[5] && <ImageWithHover src={galleryImages[5]} delay={500} isMobile={isMobile} />}
        </div>
      );
    }

    if (galleryImages.length > 6) {
      imageGrid.push(
        <div key="row-3" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <ImageWithHover src={galleryImages[6]} delay={600} isMobile={isMobile} />
          {galleryImages[7] && <ImageWithHover src={galleryImages[7]} delay={700} isMobile={isMobile} />}
        </div>
      );
    }

    if (galleryImages.length > 8) {
      const extraRows = galleryImages.slice(8);
      for (let i = 0; i < extraRows.length; i += 2) {
        imageGrid.push(
          <div key={`row-extra-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <ImageWithHover src={extraRows[i]} delay={800 + i * 100} isMobile={isMobile} />
            {extraRows[i + 1] && <ImageWithHover src={extraRows[i + 1]} delay={850 + i * 100} isMobile={isMobile} />}
          </div>
        );
      }
    }

    return (
      <>
        {heroImage}
        {imageGrid}
      </>
    );
  };

  // Check if we've had a modal interaction previously
  const wasModalOpened = typeof window !== 'undefined' && sessionStorage.getItem('modalWasOpened') === 'true';
  
  useEffect(() => {
    // Apply class to body to ensure CSS rules can target it
    if (wasModalOpened) {
      document.body.classList.add('modal-was-open');
    }
    
    return () => {
      document.body.classList.remove('modal-was-open');
    };
  }, [wasModalOpened]);

  return (
    <div className={`pt-24 sm:pt-20 md:pt-24 lg:pt-28 ${wasModalOpened ? 'modal-was-opened' : ''}`}>
      <Helmet>
        <title>{title} - {category} | The Treasured Tales</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div 
        ref={galleryRef}
        className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-2 py-6 sm:py-8 md:py-10"
      >
        {renderGalleryGrid()}
      </div>

      {modalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 ${modalFading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onClick={closeModal}
        >
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto p-2 sm:p-4 md:p-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-full p-2 sm:p-3"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={`w-full h-full flex items-center justify-center ${modalFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}>
              <img src={selectedImage} alt="Full size image" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .scroll-reveal {
          will-change: transform, opacity;
        }

        .scroll-reveal.revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        /* Ensure images are always visible after modal interaction */
        .modal-was-opened .scroll-reveal,
        body.modal-was-open .scroll-reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @media (max-width: 767px) {
          .scroll-reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          .group img {
            transition: transform 0.3s ease-out;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal {
            transition: none !important;
          }
          .scroll-reveal.revealed {
            opacity: 1 !important;
            transform: none !important;
          }
        }

        html, body {
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
        }

        * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}