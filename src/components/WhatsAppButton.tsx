import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleClick = () => {
    window.open('https://wa.me/+917259861817', '_blank');
  };

  return (
    <>
      <div
        className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} 
                  bg-white text-black 
                  p-4 
                  rounded-full shadow-lg hover:bg-white transition-colors z-40 
                  flex items-center justify-center group`}
        aria-label="Contact on WhatsApp"
      >
        <button onClick={handleClick}>
          <FaWhatsapp className='h-6 w-6'/>
        </button>
        <span className={`absolute right-full mr-4 bg-black/75 text-white px-4 py-2 
                        rounded-lg ${isMobile ? 'text-base' : 'text-lg'} 
                        whitespace-nowrap opacity-0 group-hover:opacity-100 
                        transition-opacity font-cormorant
                        ${isMobile ? 'hidden sm:block' : ''}`}>
          Chat with us
        </span>
      </div>
    </>
  );
};

export default WhatsAppButton;