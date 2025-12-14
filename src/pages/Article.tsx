import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { getGalleryPostBySlug } from '../services/wpApi';

interface GalleryPost {
  gallery_heading?: string;
  gallery_subheading?: string;
  gallery_type?: string;
  gallery_date?: string;
  gallery_images?: Array<{ url: string; full_url: string }>;
  gallery_landing_url?: string;
  slug?: string;
}

export default function Article({
  title: defaultTitle = "Gallery",
  subtitle: defaultSubtitle = "A moment captured in time.",
  category: defaultCategory = "Wedding",
  date: defaultDate = ""
}) {
  const location = useLocation();
  const scrollRevealSections = useRef<Element[]>([]);
  const [galleryData, setGalleryData] = useState<GalleryPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFading, setModalFading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Extract slug from the pathname (format: /gallery/:slug)
  const slug = location.pathname.split('/').pop() || "";

  // Get title, subtitle, category, and date from gallery data or location state or defaults
  const title = galleryData?.gallery_heading || location.state?.title || defaultTitle;
  const subtitle = galleryData?.gallery_subheading || location.state?.subtitle || defaultSubtitle;
  const category = galleryData?.gallery_type || location.state?.category || defaultCategory;
  const date = galleryData?.gallery_date || location.state?.date || defaultDate;

  // Use gallery landing image from API, or empty string as fallback
  const heroImage = galleryData?.gallery_landing_url || "";

  // Use gallery images from API, or empty array as fallback
  const galleryImages = galleryData?.gallery_images && galleryData.gallery_images.length > 0 
    ? galleryData.gallery_images.map((img: any) => img.full_url || img.url)
    : [];

  // Fetch gallery data on mount
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const data = await getGalleryPostBySlug(slug);
        if (data) {
          setGalleryData(data);
        } else {
          setError("Gallery not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch gallery");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGallery();
    }
  }, [slug]);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalOpen(true);
    setModalFading(false);
  };

  // Format date as DD/MM/YY
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const closeModal = () => {
    setModalFading(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalFading(false);
      
      // Force all scroll-reveal elements to be visible regardless of their current state
      document.querySelectorAll('.scroll-reveal').forEach((element) => {
        const el = element as HTMLElement;
        el.classList.add('revealed');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 300);
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
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

  // Initialize Intersection Observer for scroll reveals
  useEffect(() => {
    // Options for the scroll reveal observer
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.15
    };

    // Create an intersection observer for smooth reveal animations
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

    // Select all elements with the scroll-reveal class
    const sections = document.querySelectorAll('.scroll-reveal');
    sections.forEach(section => {
      revealObserver.observe(section);
      scrollRevealSections.current.push(section);
    });

    return () => {
      // Clean up the observer on component unmount
      if (scrollRevealSections.current.length > 0) {
        scrollRevealSections.current.forEach(section => {
          revealObserver.unobserve(section);
        });
      }
    };
  }, [galleryData]);

  const ImageWithHover = ({ src, alt = "Gallery image", delay = 0, isMobile }: { src: string; alt?: string; delay?: number; isMobile: boolean }) => {
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
    if (galleryImages.length === 0 || !heroImage) return null;

    const heroSection = (
      <div className="w-full mb-4 relative scroll-reveal opacity-0 transition-all duration-500 ease-out transform translate-y-4">
        <img src={heroImage} alt="Gallery hero" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 flex flex-col bg-black bg-opacity-10 text-white px-4 sm:px-8 md:px-16 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-28 justify-center">
          <h1 className="text-[10px] sm:text-base md:text-lg font-cormorant mb-2 md:mb-4 [letter-spacing:0.2em] md:[letter-spacing:0.3em] uppercase">{category} - <span className="font-agraham">{formatDate(date)}</span></h1>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-agraham mb-3 sm:mb-4 md:mb-6 uppercase">{title}</h1>
          <div className="w-10 md:w-15 lg:w-20 h-[1px] bg-white mb-4 lg:mb-6"></div>
          <p className="text-xs lg:text-xl max-w-[70%] sm:max-w-full md:max-w-xl font-cormorant">{subtitle}</p>
        </div>
      </div>
    );

    if (galleryImages.length === 1) return heroSection;

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
        {heroSection}
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

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-40">
          <div className="text-center">
            <p className="text-xl sm:text-2xl md:text-3xl font-agraham text-gray-400 mb-4 tracking-wider animate-pulse">Loading</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-20 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div 
          ref={galleryRef}
          className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-2 py-6 sm:py-8 md:py-10"
        >
          {renderGalleryGrid()}
        </div>
      )}

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

      <style>{`
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