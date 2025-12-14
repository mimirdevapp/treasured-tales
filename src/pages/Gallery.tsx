import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { getGalleryPosts } from '../services/wpApi';

const Gallery = () => {
  const scrollRevealSections = useRef([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Format date as "Month Day, Year"
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Fetch gallery posts from API
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const galleries = await getGalleryPosts();
        if (galleries?.length > 0) {
          const mappedGalleries = galleries.map((item: any) => ({
            id: item.id,
            title: item.gallery_heading || item.title?.rendered || "Gallery",
            date: formatDate(item.gallery_date || item.date),
            category: item.gallery_type || "WEDDING",
            image: item.gallery_thumbnail_url || "",
            link: `/gallery/${item.slug}`
          }));
          setGalleryItems(mappedGalleries);
        }
      } catch (error) {
        console.error("Error fetching galleries:", error);
        // Keep defaults on error
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Initialize Intersection Observer for scroll reveals
  useEffect(() => {
    // Options for the scroll reveal observer
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px 0px -100px 0px', // Trigger a bit before elements come into view
      threshold: 0.15 // Trigger when 15% of the element is visible
    };

    // Create an intersection observer for smooth reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for smoother animations
          requestAnimationFrame(() => {
            entry.target.classList.add('revealed');
          });
          // Once revealed, we don't need to observe it anymore
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
  }, [galleryItems]);

  return (
    <div className="pt-16">
      <Helmet>
        <title>Gallery | The Treasured Tales</title>
      </Helmet>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-40">
          <div className="text-center">
            <p className="text-xl sm:text-2xl md:text-3xl font-agraham text-gray-400 mb-4 tracking-wider animate-pulse">Loading</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8">
              <h1 className="text-5xl lg:text-7xl font-agraham text-gray-800 mb-4 lg:mb-6 tracking">Gallery</h1>
              <div className="w-20 h-[1px] bg-black/30"></div>
            </div>

            <div className="py-12 transition-all ease-out">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="group relative group relative overflow-hidden scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8 overflow-hidden">
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
                          <p className="mt-1 sm:mt-2 text-xs tracking-widest font-montserrat">{item.date} / {item.category.toUpperCase()}</p>
                          <span className="mt-3 sm:mt-4 md:mt-6 text-xs tracking-widest font-montserrat border-b border-white pb-1">VIEW GALLERY</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CSS for scroll animations */}
      <style jsx="true">{`
        /* Add will-change to optimize animations */
        .scroll-reveal {
          will-change: transform, opacity;
        }
        
        /* Gradually reveal sections with better easing function */
        .scroll-reveal.revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), 
                     transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
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
      `}</style>
    </div>
  );
};

export default Gallery;