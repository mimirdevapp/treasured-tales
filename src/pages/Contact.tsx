import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Check } from 'lucide-react';
import { Helmet } from "react-helmet";
import { WP_API_URL } from '../services/wpApi';
import SEO from '../components/SEO';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const scrollRevealSections = useRef([]);
  
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
      if (scrollRevealSections.current.length > 0) {
        scrollRevealSections.current.forEach(section => {
          revealObserver.unobserve(section);
        });
      }
    };
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${WP_API_URL}/wp-json/custom/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      }, 3000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <SEO
        title="Contact Us | The Treasured Tales"
        description="Get in touch with Adithya D Ullal for wedding photography, event coverage, and professional photography services. Contact The Treasured Tales today."
        keywords="contact photographer, booking, wedding photography inquiry, The Treasured Tales, Adithya D Ullal"
        url="https://thetreasuredtales.com/contact"
        canonical="https://thetreasuredtales.com/contact"
      >
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact The Treasured Tales",
            "url": "https://thetreasuredtales.com/contact",
            "mainEntity": {
              "@type": "ProfessionalService",
              "name": "The Treasured Tales",
              "contact": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "availableLanguage": "en"
              }
            }
          })}
        </script>
      </SEO>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8">
          <h1 className="text-5xl lg:text-7xl font-agraham mb-4 lg:mb-6 text-gray-800">Get in Touch</h1>
          <div className="w-20 h-[1px] bg-black/30 mb-10 lg:mb-20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 lg:gap-16 relative">
          {/* Left column - Contact info */}
          <div className="space-y-10 md:pr-8 scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8" style={{ transitionDelay: '150ms' }}>
            <p className="text-gray-600 text-2xl font-cormorant">
              We'd love to hear from you! Whether you're planning a special occasion or looking to capture
              precious moments, let's discuss how we can create beautiful memories together.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6" />
                <span><a href="mailto:thetreasuredtales.in@gmail.com" className="hover:text-[#8C5117] transition-colors">thetreasuredtales.in@gmail.com</a></span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6" />
                <span><a href="tel:+917259861817" className="hover:text-[#8C5117] transition-colors">+91 7259861817</a></span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        
          
          {/* Right column - Form */}
          <form className="space-y-6 md:pl-8 scroll-reveal opacity-0 transition-all duration-1000 ease-out transform translate-y-8" style={{ transitionDelay: '300ms' }} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-md font-medium text-gray-700 font-cormorant">Name</label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-[#8C5117] shadow-sm focus:border-black focus:ring-1 focus:ring-black p-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-md font-medium text-gray-700 font-cormorant">Email</label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-[#8C5117] shadow-sm focus:border-black focus:ring-1 focus:ring-black p-2"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-md font-medium text-gray-700 font-cormorant">Phone</label>
              <input
                type="tel"
                id="phone"
                value={formState.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-[#8C5117] shadow-sm focus:border-black focus:ring-1 focus:ring-black p-2"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-md font-medium text-gray-700 font-cormorant">Event Details / Dates</label>
              <textarea
                id="message"
                rows={6}
                value={formState.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-[#8C5117] shadow-sm focus:border-black focus:ring-1 focus:ring-black p-2"
              ></textarea>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`w-full flex justify-center items-center px-12 py-4 border transition-all duration-300 font-montserrat tracking-wider text-sm ${
                isSubmitted
                  ? 'bg-green-600 text-white border-green-600'
                  : isSubmitting
                  ? 'bg-gray-200 text-gray-500 border-gray-300'
                  : 'border-[#8C5117] text-[#8C5117] hover:bg-[#8C5117] hover:text-white'
              }`}
            >
              {isSubmitted ? (
                <span className="flex items-center">
                  SENT <Check className="ml-2 h-5 w-5" />
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center">
                  SENDING...
                  <span className="ml-2 h-5 w-5 border-t-2 border-b-2 border-current rounded-full animate-spin"></span>
                </span>
              ) : (
                'SEND MESSAGE'
              )}
            </button>
          </form>
        </div>
      </div>

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

export default Contact;