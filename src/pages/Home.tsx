import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { ArrowRight } from 'lucide-react';
import { getHeroSlides, getIntroductionSection, getHomeVideo, getFeaturedWorks, getTestimonials, getGalleryPosts } from '../services/wpApi';
import ReactPlayer from 'react-player/lazy'; // Import ReactPlayer with lazy loading
import adi from '../assets/aadithya.jpg'
import mobile1 from '../assets/mobile1.jpg';
import mobile2 from '../assets/mobile2.jpg';
import mobile3 from '../assets/mobile3.jpg';
import mobile4 from '../assets/mobile4.jpg';
import mobile5 from '../assets/mobile5.jpg';
import mobile6 from '../assets/mobile6.jpg';
import mobile7 from '../assets/mobile7.jpg';
import mobile8 from '../assets/mobile8.jpg';
import mobile9 from '../assets/mobile9.jpg';
import mobile10 from '../assets/mobile10.jpg';
import mobile11 from '../assets/mobile11.jpg';
import decode from '../utils/htmlDecode';

// Preset images for mobile hero section
const PRESET_MOBILE_HERO_IMAGES = [
  mobile1,
  mobile2,
  mobile3,
  mobile4,
  mobile5,
  mobile6,
  mobile7,
  mobile8,
  mobile9,
  mobile10,
  mobile11
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFading, setModalFading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [homeSection, setHomeSection] = useState<any>(null);
  const [videoData, setVideoData] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  const parallaxRef = useRef(null);
  const videoSectionRef = useRef(null);
  const playerRef = useRef(null);
  const observer = useRef(null);
  const scrollRevealSections = useRef([]);

  useEffect(() => {
    const fetchCritical = async () => {
      try {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        // Use preset images for mobile, fetch API for desktop
        if (isMobile) {
          setHeroImages(PRESET_MOBILE_HERO_IMAGES);
        } else {
          const [slides] = await Promise.all([
            getHeroSlides(),
          ]);

          if (slides?.length > 0) {
            setHeroImages(slides.map((s: any) => s.featured_media_url || ""));
          }
        }

      } catch (e) {
        console.error(e);
      }
    };

    fetchCritical();
  }, []);

  useEffect(() => {
    getIntroductionSection().then(section => section?.acf && setHomeSection(section.acf));
    getHomeVideo().then(v => v?.acf && setVideoData(v.acf));
    getTestimonials().then(t => t?.length && setTestimonials(t));
    getFeaturedWorks().then(f =>
      f?.length && setCarouselImages(f.map((i: any) => i.featured_media_url || ""))
    );
    getGalleryPosts().then(g =>
      g?.length && setGalleryItems(
        g.slice(0, 6).map((item: any) => ({
          id: item.id,
          title: item.gallery_heading || item.title?.rendered || "Gallery",
          date: item.gallery_date || new Date(item.date).toLocaleDateString(),
          category: item.gallery_type || "WEDDING",
          image: item.gallery_thumbnail_url || "",
          link: `/gallery/${item.slug}`
        }))
      )
    );
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      document.body.classList.add('is-mobile');
    }

    return () => {
      document.body.classList.remove('is-mobile');
    };
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px', 
      threshold: 0.15
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
  }, [testimonials]);

  // Handle hero section image rotation
  useEffect(() => {
    if (heroImages.length === 0) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages]);

    // Handle video playback and parallax effect
    useEffect(() => {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          setVideoPlaying(entry.isIntersecting);
        },
        { threshold: 0.3 }
      );

      if (videoSectionRef.current) {
        observer.current.observe(videoSectionRef.current);
      }

      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            setScrollY(window.scrollY);
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      const handleEscKey = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };

      window.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = modalOpen ? 'hidden' : '';

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('keydown', handleEscKey);

        if (observer.current && videoSectionRef.current) {
          observer.current.unobserve(videoSectionRef.current);
        }
      };
    }, [modalOpen]);


  // Apply parallax effect when scroll position changes
  useEffect(() => {
    if (parallaxRef.current) {
      // Use transform with translate3d for hardware acceleration
      parallaxRef.current.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
    }
  }, [scrollY]);

  useEffect(() => {
    // Enable smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace('#', '');

    // wait for DOM + layout + images
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }, [location.hash]);


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
    }, 300);
  };

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>Home | The Treasured Tales</title>
        {heroImages[0] && (
        <link
          rel="preload"
          as="image"
          href={heroImages[0]}
          fetchpriority="high"
        />
      )}
      </Helmet>
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-0 h-[120%] top-0 will-change-transform">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                } ${isTransitioning ? 'transition-timing-function-ease-out' : ''}`}
            >
              <img
                src={image}
                loading={currentImageIndex === index ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={currentImageIndex === index ? "high" : "low"}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4 md:transform-none transform -translate-y-16">
            <h1 className="text-4xl sm:text-4xl md:text-6xl font-agraham mb-3 md:mb-6 tracking-widest leading-tight">Timeless tales of love</h1>
            <h1 className="text-lg sm:text-xl md:text-3xl font-cormorant mb-4 md:mb-6">Every frame, a story crafted with passion.</h1>
          </div>
        </div>
      </div>

      {/*  Introduction Section */}
      <div className="py-12 sm:py-16 md:py-24 bg-white scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="md:order-2">
              <img
                src={homeSection?.home_image?.sizes?.large || ""}
                className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover"
              />
            </div>
            <div className="space-y-4 md:space-y-8 md:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-agraham font-light text-gray-800 leading-tight">
                {homeSection?.home_title || ""}
              </h2>
              <h3 className="text-base md:text-lg tracking-widest text-[#8C5117] font-semibold italic font-cormorant">
                {homeSection?.home_subtext ? (
                  <span className="text-[#8C5117]">{homeSection.home_subtext}</span>
                ) : (
                  ""
                )}
              </h3>
              <div className="w-20 h-[1px] bg-black/30"></div>
              <p className="text-black font-cormorant text-lg md:text-xl leading-relaxed">
                {homeSection?.home_description ? (
                  homeSection.home_description.split('\r\n')[0]
                ) : (
                  ""
                )}
              </p>
              {homeSection?.home_description && homeSection.home_description.includes('\r\n') && (
                <p className="text-black font-cormorant text-lg md:text-xl leading-relaxed">
                  {homeSection.home_description.split('\r\n').slice(1).join('\n')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Treasured Moments */}
      <div className="py-16 md:py-24 bg-[#f8f4f0] scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8" id="featured-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl font-agraham text-gray-800">Treasured Moments</h2>
            <div className="flex items-center justify-center my-4">
              <div className="hidden sm:block h-px w-16 bg-black/30"></div>
              <p className="mx-2 sm:mx-4 text-base md:text-lg tracking-widest text-[#8C5117] font-semibold italic font-cormorant">preserving the moments that matter most</p>
              <div className="hidden sm:block h-px w-16 bg-black/30"></div>
            </div>
          </div>

          <Splide
            options={{
              type: 'loop',
              perPage: 3,
              perMove: 1,
              gap: '1rem',
              padding: { left: '0', right: '0' },
              arrows: true,
              pagination: true,
              autoplay: true,
              interval: 3000,
              pauseOnHover: true,
              resetProgress: false,
              height: 'auto',
              breakpoints: {
                1024: {
                  perPage: 2,
                },
                768: {
                  perPage: 1,
                  arrows: false,
                  padding: { left: '1rem', right: '1rem' }, // Add padding
                  pagination: true, // Hide pagination on mobile
                },
                640: {
                  perPage: 1,
                  arrows: false,
                  padding: { left: '1rem', right: '1rem' },
                  gap: '0.5rem', // Reduce gap on smallest screens
                  pagination: true, // Hide pagination on mobile
                },
              },
            }}
            className="portfolio-splide"
          >
            {carouselImages.map((image, index) => (
              <SplideSlide key={index} className="px-2">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer overflow-hidden"
                  onClick={() => openModal(image)}
                >
                  <div className="aspect-w-3 aspect-h-4 relative" style={{ maxHeight: '450px' }}>
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: 'center' }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm tracking-widest font-montserrat border-b border-white pb-1">VIEW</span>
                    </div>
                  </div>
                </motion.div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      </div>

      {/* Video Section */}
      <div ref={videoSectionRef} className="relative h-[80vh] md:h-screen w-full overflow-hidden scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <ReactPlayer
              ref={playerRef}
              url={videoData?.video_file || ""}
              playing={videoPlaying}
              loop
              muted
              playsinline
              width="100%"
              height="100%"
              config={{
                file: {
                  attributes: {
                    muted: true,
                    playsInline: true,
                    autoPlay: true,
                    style: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }
                }
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 px-4">
          <h2 className="text-4xl md:text-6xl font-agraham mb-6 md:mb-8 tracking-wide">{videoData?.video_heading || ""}</h2>
          <div className="w-20 h-[1px] bg-white mb-6 md:mb-8"></div>
          <div className="max-w-3xl text-center">
            <p className="font-cormorant leading-relaxed text-lg md:text-2xl mb-8">
              {videoData?.video_description || ""}
            </p>
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="py-16 md:py-24 bg-white scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl font-agraham text-gray-800">Gallery</h2>
            <div className="flex items-center justify-center my-4">
              <div className="hidden sm:block h-px w-16 bg-black/30"></div>
              <p className="mx-2 sm:mx-4 text-base md:text-lg tracking-widest text-[#8C5117] font-semibold italic font-cormorant">a curated collection of wedding & engagement stories</p>
              <div className="hidden sm:block h-px w-16 bg-black/30"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="group relative overflow-hidden">
                <Link to={item.link} className="block">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 bg-black/40 md:bg-transparent">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-cormorant">{item.title}</h3>
                    <p className="mt-1 sm:mt-2 text-xs tracking-widest font-montserrat">{item.date} / {item.category}</p>
                    <span className="mt-3 sm:mt-4 md:mt-6 text-xs tracking-widest font-montserrat border-b border-white pb-1">VIEW GALLERY</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-16 items-center justify-center text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center px-8 md:px-12 py-3 md:py-4 border border-[#8C5117] hover:bg-[#8C5117] hover:text-white text-[#8C5117] font-montserrat tracking-wider text-sm transition-all duration-300 group"
            >
              VIEW MORE
              <ArrowRight
                className='ml-2 transition-transform duration-300'
                size={16}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* TESTIMONIAL */}
      {testimonials.length > 0 && (
      <div className="py-16 md:py-24 bg-[#f8f4f0] scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8" id="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl md:text-7xl font-agraham text-gray-800">TESTIMONIALS</h2>
            <div className="flex items-center justify-center my-4 mb-8 md:mb-16">
              <div className="hidden sm:block h-px w-16 bg-black/30"></div>
              <p className="mx-2 sm:mx-4 text-base md:text-lg tracking-widest text-[#8C5117] font-semibold italic font-cormorant">some kind words from our clients</p>
              <div className="hidden sm:block h-px w-16 bg-black/30"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:space-x-8 mb-8 md:mb-12">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => setActiveTestimonial(index)}
                  className={`py-2 md:py-3 px-3 md:px-4 border-b-2 transition-all duration-300 font-cormorant text-transform: uppercase text-sm md:text-base ${activeTestimonial === index
                    ? 'border-[#8C5117] text-[#8C5117] font-bold'
                    : 'border-transparent text-gray-500 hover:text-[#8C5117] hover:border-[#8C5117]/30'
                    }`}
                >
                  {testimonial.couple}
                </button>
              ))}
            </div>

            {testimonials[activeTestimonial] && (
            <div className="max-w-4xl mx-auto w-full">
              <div className="w-full h-[250px] sm:h-[300px] md:h-[650px] overflow-hidden relative mb-4 sm:mb-6 md:mb-10 testimonial-image">
                <div className="relative w-full h-full transition-opacity duration-500">
                  <img
                    src={testimonials[activeTestimonial]?.image}
                    alt={testimonials[activeTestimonial]?.couple}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30">
                    <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
                      <h3 className="text-2xl md:text-4xl font-agraham text-white">{testimonials[activeTestimonial]?.couple}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-8 p-4 testimonial-quote">
                <div className="w-20 md:w-32 h-[1px] bg-black/30"></div>
                <p className="font-cormorant text-lg md:text-2xl italic leading-relaxed max-w-4xl mx-auto">
                  "{decode(testimonials[activeTestimonial]?.quote)}"
                </p>
              </div>
            </div>
            )}

            <div className="mt-6 md:mt-8">
              <Link
                to="/contact"
                className="inline-block px-8 md:px-12 py-3 md:py-4 border border-[#8C5117] hover:bg-[#8C5117] hover:text-white text-[#8C5117] font-montserrat tracking-wider text-sm transition-all duration-300"
              >
                GET IN TOUCH
              </Link>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* About Section */}
      <div className="py-16 md:py-24 bg-white scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8" id="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative">
              <img
                src={adi}
                 loading="lazy"
                decoding="async"
                className="w-full h-[300px] md:h-[600px] object-cover"
              />
            </div>
            <div className="space-y-4 md:space-y-8 px-0 md:px-6">
              <h2 className="text-4xl md:text-6xl font-agraham text-gray-800">Our Story</h2>
              <div className="w-20 h-[1px] bg-black/30"></div>
              <p className="text-black font-cormorant text-lg md:text-xl leading-relaxed">
                Amidst the whirlwind of life's most cherished moments, there existed a desire to capture more than just images. The Treasured Tales began as a vision to weave together the raw emotions and candid memories that make each wedding day unique.
              </p>
              <p className="text-black font-cormorant text-lg md:text-xl leading-relaxed">
                Our journey is guided by the belief that every photograph should tell a story-a story of love, of laughter, of tears of joy. We understand that behind every smile and every tear lies a tale waiting to be treasured forever.
              </p>
              <div className="pt-2 md:pt-4">
                <span className="font-cormorant text-2xl md:text-3xl italic">Adithya D Ullal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {modalOpen && (
        <div
          className={`fixed inset-0 z-50 bg-black/95 transition-opacity duration-300 ${
            modalFading ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            aria-label="Close"
            className="
              absolute top-4 right-4 z-50
              h-10 w-10
              flex items-center justify-center
              rounded-full
              bg-white/15 backdrop-blur-sm
              text-white text-lg
              hover:bg-white/25
              transition-colors
              touch-manipulation
            "
          >
            ✕
          </button>

          <div
            className="w-screen h-screen flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Full size image"
              className="h-screen w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}


      <style jsx="true"> 
      {`
        /* Add will-change to optimize animations */
        .scroll-reveal {
          will-change: transform, opacity;
        }
        
        /* Custom aspect ratio support */
        .aspect-w-3 {
          position: relative;
          padding-bottom: calc(4 / 3 * 100%);
        }

        .aspect-w-3 > img {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          object-fit: cover;
          object-position: center;
        }

        /* Gradually reveal sections with better easing function */
        .scroll-reveal.revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), 
                     transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        
        /* Custom splide carousel styling */
        .portfolio-splide .splide__arrow {
          background: rgba(0, 0, 0, 0.0);
          width: 3rem;
          height: 3rem;
        }
        
        .portfolio-splide .splide__arrow svg {
          fill: white;
          width: 1.2em;
          height: 1.2em;
        }
        
        .portfolio-splide .splide__pagination__page {
          background: #ccc;
          opacity: 0.7;
        }
        
        .portfolio-splide .splide__pagination__page.is-active {
          background: black;
          transform: scale(1.2);
        }

        /* Add subtle staggered animation to gallery items on first load */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Optimize for lower end devices */
        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal {
            transition: none !important;
        }
          
          .scroll-reveal.revealed {
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* Mobile optimization */
          @media (max-width: 640px) {
          /* Remove the padding-bottom change to aspect-w-3 */
        .aspect-w-3 {
            padding-bottom: calc(4 / 3 * 100%) !important; 
          }
          .portfolio-splide {
            padding-bottom: 0;
          }
              .parallax-disabled {
            transform: none !important;
          }

          .scroll-reveal {
            transition-duration: 800ms;
        }

  
        /* Better video handling on mobile */
        .video-section {
          height: 70vh; /* Shorter on mobile */
        }
      }
      
      /* Improve touch targets on mobile */
      @media (max-width: 768px) {
        .portfolio-splide .splide__slide {
          touch-action: pan-y;
        }
        
        /* Make buttons more tappable */

      }
    `}
      </style>
    </div>
  );
};

export default Home;