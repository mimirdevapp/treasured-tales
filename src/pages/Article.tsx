import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { getGalleryPostBySlug } from '../services/wpApi';
import decode from '../utils/htmlDecode';

interface GalleryPost {
  gallery_heading?: string;
  gallery_subheading?: string;
  gallery_type?: string;
  gallery_date?: string;
  gallery_images?: Array<{ url: string; full_url: string, sizes: Array<any> }>;
  gallery_landing_image?: string;
  slug?: string;
}

export default function Article({
  title: defaultTitle = "Gallery",
  subtitle: defaultSubtitle = "A moment captured in time.",
  category: defaultCategory = "Wedding",
  date: defaultDate = ""
}) {
  const location = useLocation();
  const [galleryData, setGalleryData] = useState<GalleryPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFading, setModalFading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const slug = location.pathname.split('/').pop() || "";

  const title = galleryData?.gallery_heading || location.state?.title || defaultTitle;
  const subtitle = galleryData?.gallery_subheading || location.state?.subtitle || defaultSubtitle;
  const category = galleryData?.gallery_type || location.state?.category || defaultCategory;
  const dateValue = galleryData?.gallery_date || location.state?.date || defaultDate;

  const heroImage = galleryData?.gallery_landing_image || "";
  const galleryImages = galleryData?.gallery_images;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const data = await getGalleryPostBySlug(slug);
        if (data) setGalleryData(data);
        else setError("Gallery not found");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch gallery");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchGallery();
  }, [slug]);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalOpen(true);
    setModalFading(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalFading(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalFading(false);
      document.body.style.overflow = '';
    }, 250);
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (modalOpen) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [modalOpen]);

  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        })
      : "";

  const ImageWithHover = ({ src }: { src: string }) => (
    <div
      className="relative group cursor-pointer overflow-hidden"
      onClick={() => openModal(src)}
    >
      <img
        src={src}
        alt="Gallery"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {!isMobile && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs md:text-sm tracking-widest font-montserrat border-b border-white pb-1">
            VIEW
          </span>
        </div>
      )}
    </div>
  );

  const renderGalleryGrid = () => {
    const rows = [];

    for (let i = 0; i < galleryImages.length; i += 2) {
      rows.push(
        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <ImageWithHover src={galleryImages[i]} />
          {galleryImages[i + 1] && <ImageWithHover src={galleryImages[i + 1]} />}
        </div>
      );
    }

    return (
      <>
        {heroImage && (
          <div className="w-full mb-4 relative">
            <img src={heroImage} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 flex flex-col bg-black/10 text-white px-4 sm:px-8 md:px-16 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-28 justify-center">
              <h1 className="text-[10px] sm:text-base md:text-lg font-cormorant mb-2 md:mb-4 [letter-spacing:0.2em] md:[letter-spacing:0.3em] uppercase">
                {category} - <span className="font-agraham">{formatDate(dateValue)}</span>
              </h1>
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-agraham mb-3 sm:mb-4 md:mb-6 uppercase">
                {title}
              </h1>
              <p className="text-xs lg:text-xl max-w-[70%] sm:max-w-full md:max-w-xl font-cormorant">
                {decode(subtitle)}
              </p>
            </div>
          </div>
        )}
        {rows}
      </>
    );
  };

  return (
    <div className="pt-24 sm:pt-20 md:pt-24 lg:pt-28">
      <Helmet>
        <title>{title} - {category} | The Treasured Tales</title>
      </Helmet>

      {!loading && !error && (
        <div
          ref={galleryRef}
          className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6"
        >
          {renderGalleryGrid()}
        </div>
      )}

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
              alt="Full view"
              className="h-screen w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
