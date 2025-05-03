import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
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
    // Modal state
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalFading, setModalFading] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const scrollRevealSections = useRef([]);

    const title = location.state?.title || defaultTitle;
    const subtitle = location.state?.subtitle || defaultSubtitle;
    const category = location.state?.category || defaultCategory;
    const date = location.state?.date || defaultDate;

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

    // Fallback images in case none are provided
    const fallbackImages = [
        dslr1,
        dslr2,
        dslr3,
        dslr4,
        dslr5,
        dslr6,
        dslr7,
        dslr8,
        dslr9,
        dslr10,
        dslr13,
        dslr14,
        dslr15,
        dslr16,
        dslr20,
        dslr99
    ];

    // Use provided images or fallbacks
    const galleryImages = images.length > 0 ? images : fallbackImages;

    // Modal functions
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

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        // Prevent scrolling when modal is open
        if (modalOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscKey);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = '';
        };
    }, [modalOpen]);

    // Image wrapper component with hover effect
    const ImageWithHover = ({ src, alt = "Gallery image", delay = 0 }) => (
        <div
            className="relative group cursor-pointer overflow-hidden scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8"
            style={{ transitionDelay: `${delay}ms` }}
            onClick={() => openModal(src)}
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm tracking-widest font-montserrat border-b border-white pb-1">VIEW</span>
            </div>
        </div>
    );

    // Helper function to create grid layouts based on available images
    const renderGalleryGrid = () => {
        // If no images, don't render anything
        if (galleryImages.length === 0) return null;

        // Always show first image as hero with text overlay if available
        const heroImage = (
            <div className="w-full mb-2 relative scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8">
                <img
                    src={hero}
                    alt="Gallery hero"
                    className="w-full h-auto object-contain"
                />
                <div className="absolute inset-0 flex flex-col bg-black bg-opacity-10 text-white px-20 py-28">
                    <h1 className="text-lg font-cormorant mb-4 [letter-spacing:0.3em] uppercase">{category} - <span className="font-agraham">{date}</span></h1>
                    <h1 className="text-2xl md:text-6xl font-agraham mb-6 uppercase">{title}</h1>
                    <p className="text-xl max-w-xl font-cormorant">
                        {subtitle}
                    </p>
                </div>
            </div>
        );

        // If only one image, just return the hero
        if (galleryImages.length === 1) return heroImage;

        // Calculate how to arrange the remaining images
        const remainingImages = galleryImages.slice(1);
        const gridElements = [];

        // First row after hero - 2 columns if enough images
        if (remainingImages.length >= 2) {
            gridElements.push(
                <div key="row-1" className="grid grid-cols-2 gap-2 mb-2">
                    <div className="w-full">
                        <ImageWithHover src={remainingImages[0]} alt="Gallery image" delay={150} />
                    </div>
                    <div className="w-full">
                        <ImageWithHover src={remainingImages[1]} alt="Gallery image" delay={300} />
                    </div>
                </div>
            );
        } else if (remainingImages.length === 1) {
            // Just one remaining image - full width
            gridElements.push(
                <div key="row-1" className="mb-2">
                    <ImageWithHover src={remainingImages[0]} alt="Gallery image" delay={150} />
                </div>
            );
        }

        // Second row - 3 columns if enough images
        if (remainingImages.length >= 5) {
            gridElements.push(
                <div key="row-2" className="grid grid-cols-3 gap-2 mb-2">
                    <div className="w-full">
                        <ImageWithHover src={remainingImages[2]} alt="Gallery image" delay={450} />
                    </div>
                    <div className="w-full">
                        <ImageWithHover src={remainingImages[3]} alt="Gallery image" delay={600} />
                    </div>
                    <div className="w-full">
                        <ImageWithHover src={remainingImages[4]} alt="Gallery image" delay={750} />
                    </div>
                </div>
            );
        } else if (remainingImages.length > 2) {
            // Handle 3 or 4 remaining images after the first row
            const columns = remainingImages.length - 2 >= 3 ? 3 : remainingImages.length - 2;
            gridElements.push(
                <div key="row-2" className={`grid grid-cols-${columns} gap-2 mb-2`}>
                    {remainingImages.slice(2).map((img, idx) => (
                        <div key={idx} className="w-full">
                            <ImageWithHover src={img} alt="Gallery image" delay={450 + (idx * 150)} />
                        </div>
                    ))}
                </div>
            );
        }

        // Third row - 2 columns if there are even more images
        if (remainingImages.length >= 7) {
            gridElements.push(
                <div key="row-3" className="grid grid-cols-2 gap-2">
                    <div className="w-full">
                        <ImageWithHover src={remainingImages[5]} alt="Gallery image" delay={900} />
                    </div>
                    <div className="w-full">
                        <ImageWithHover src={remainingImages[6]} alt="Gallery image" delay={1050} />
                    </div>
                </div>
            );
        }

        return (
            <>
                {heroImage}
                {gridElements}
            </>
        );
    };

    return (
        <div className="pt-28">
            <Helmet>
                <title>{title} - {category} | The Treasured Tales</title>
            </Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2 py-10">
                {renderGalleryGrid()}
            </div>

            {/* Lightbox Modal with Fade Effect */}
            {modalOpen && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 ${modalFading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto p-4 md:p-8 flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-full p-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image container */}
                        <div className={`w-full h-full flex items-center justify-center ${modalFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}>
                            <img
                                src={selectedImage}
                                alt="Full size image"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
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
}