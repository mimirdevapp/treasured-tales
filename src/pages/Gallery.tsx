import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
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
import dslr11 from '../assets/dslr(11).heic';
import dslr13 from '../assets/dslr13.jpg';
import dslr14 from '../assets/dslr14.jpg';
import dslr15 from '../assets/dslr15.jpg';
import dslr16 from '../assets/dslr16.jpg';
import dslr20 from '../assets/dslr20.jpg';
import dslr99 from '../assets/dslr99.heic';

const Gallery = () => {
  const scrollRevealSections = useRef([]);

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
  }, []);

  const galleryItems = [
    {
      id: 1,
      title: "Lavanya & Eshan",
      date: "March 18, 2025",
      category: "WEDDING",
      image: dslr7,
      link: "/gallery/lavanya-eshan-wedding"
    },
    {
      id: 2,
      title: "Rahul & Sanjana",
      date: "April 5, 2023",
      category: "HALDI",
      image: dslr4,
      link: "/gallery/rahul-sanjana-haldi"
    },
    {
      id: 3,
      title: "Gauthum & Meghana",
      date: "June 12, 2024",
      category: "WEDDING",
      image: dslr1,
      link: "/gallery/gauthum-meghana-wedding"
    },
    {
      id: 4,
      title: "Lavanya & Eshan",
      date: "February 24, 2025",
      category: "ENGAGEMENT",
      image: dslr20,
      link: "/gallery/lavanya-eshan-engagement"
    },
    {
      id: 5,
      title: "Gauthum & Meghana",
      date: "May 30, 2024",
      category: "SANGEET",
      image: dslr5,
      link: "/gallery/gauthum-meghana-sangeet"
    },
    {
      id: 6,
      title: "Rahul & Sanjana",
      date: "August 17, 2024",
      category: "ENGAGEMENT",
      image: dslr2,
      link: "/gallery/rahul-sanjana-engagement"
    },
    {
      id: 7,
      title: "Lavanya & Eshan",
      date: "July 08, 2024",
      category: "HALDI",
      image: dslr3,
      link: "/gallery/lavanya-eshan-haldi"
    },
    {
      id: 8,
      title: "Gauthum & Meghana",
      date: "March 04, 2023",
      category: "ENGAGEMENT",
      image: dslr11,
      link: "/gallery/gauthum-meghana-engagement"
    },
  ];

  return (
    <div className="pt-16">
      <Helmet>
        <title>Gallery | The Treasured Tales</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8">
          <h1 className="text-7xl font-agraham text-gray-800 mb-6 tracking">Gallery</h1>
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
                      <p className="mt-1 sm:mt-2 text-xs tracking-widest font-montserrat">{item.date} / {item.category}</p>
                      <span className="mt-3 sm:mt-4 md:mt-6 text-xs tracking-widest font-montserrat border-b border-white pb-1">VIEW GALLERY</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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