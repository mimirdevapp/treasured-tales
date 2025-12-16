export const WP_API_URL = import.meta.env.VITE_WP_BASE;
const WP_BASE = `${WP_API_URL}/wp-json/wp/v2`;

export async function getHeroSlides() {
  const res = await fetch(`${WP_BASE}/slide_show`);
  if (!res.ok) throw new Error("Failed to fetch hero slides");
  const data = await res.json();
  const slides = Array.isArray(data) ? data : [data];
  
  // Extract images from meta_box.slide_show array and return as flat array
  const slideImages: any[] = [];
  slides.forEach((slide: any) => {
    const metaBox = slide.meta_box || {};
    const images = Array.isArray(metaBox.slide_show) ? metaBox.slide_show : [];
    
    // Add each image as a slide object with featured_media_url
    images.forEach((img: any) => {
      slideImages.push({
        featured_media_url: img.full_url || img.url || ""
      });
    });
  });
  
  return slideImages;
}

export async function getIntroductionSection() {
  const res = await fetch(`${WP_BASE}/first_section`);
  if (!res.ok) throw new Error("Failed to fetch static section");
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data; // handle both array and object
}

export async function getHomeVideo() {
  const res = await fetch(`${WP_BASE}/video_section`);
  if (!res.ok) throw new Error("Failed to fetch video");
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data; // handle both array and object
}

export async function getFeaturedWorks() {
  const res = await fetch(`${WP_BASE}/featured_works`);
  if (!res.ok) throw new Error("Failed to fetch featured works");
  const data = await res.json();
  const works = Array.isArray(data) ? data : [data];
  
  // Extract images from meta_box.featured_works array and return as flat array
  const workImages: any[] = [];
  works.forEach((work: any) => {
    const metaBox = work.meta_box || {};
    const images = Array.isArray(metaBox.featured_works) ? metaBox.featured_works : [];
    
    // Add each image as a carousel item
    images.forEach((img: any) => {
      workImages.push({
        featured_media_url: img.full_url || img.url || ""
      });
    });
  });
  
  return workImages;
}

export async function getTestimonials() {
  const res = await fetch(`${WP_BASE}/testimonials_section`);
  if (!res.ok) throw new Error("Failed to fetch testimonials");

  const data = await res.json();
  const testimonialsList = Array.isArray(data) ? data : [data];

  const testimonials: any[] = [];

  testimonialsList.forEach((item: any, sectionIndex: number) => {
    const metaBox = item.meta_box || {};

    // Find all testimonial numbers dynamically
    const testimonialNumbers = Object.keys(metaBox)
      .filter(key => key.startsWith("testimonial_title_"))
      .map(key => key.replace("testimonial_title_", ""));

    testimonialNumbers.forEach((num) => {
      const couple = metaBox[`testimonial_title_${num}`] || "";
      const quote = metaBox[`testimonial_description_${num}`] || "";
      const imageArr = metaBox[`testimonial_image_${num}`] || [];
      const imageObj = Array.isArray(imageArr) ? imageArr[0] : null;
      const image = imageObj?.full_url || imageObj?.url || "";

      if (couple && quote) {
        testimonials.push({
          id: `testimonial-${sectionIndex}-${num}`, // ✅ UNIQUE & STABLE
          couple,
          quote,
          image,
        });
      }
    });
  });

  return testimonials;
}

/* ---------------- GALLERY POSTS ---------------- */

export async function getGalleryPosts() {
  const res = await fetch(`${WP_BASE}/gallery_posts`);
  if (!res.ok) throw new Error("Failed to fetch gallery posts");
  const data = await res.json();
  const galleries = Array.isArray(data) ? data : [data];
  
  // Map galleries with extracted data from meta_box
  const galleriesWithImages = galleries.map((gallery: any) => {
    const metaBox = gallery.meta_box || {};
    const thumbnail = Array.isArray(metaBox.gallery_thumbnail) ? metaBox.gallery_thumbnail[0] : null;
    const landingImage = Array.isArray(metaBox.gallery_landing) ? metaBox.gallery_landing[0] : null;
    
    return {
      ...gallery,
      gallery_heading: metaBox.gallery_heading || "",
      gallery_subheading: metaBox.gallery_subheading || "",
      gallery_type: metaBox.gallery_type || "Wedding",
      gallery_date: metaBox.gallery_date || "",
      gallery_thumbnail_url: thumbnail?.full_url || "",
      gallery_landing_url: landingImage?.full_url || "",
      gallery_images: metaBox.gallery_images || []
    };
  });
  
  return galleriesWithImages;
}

export async function getGalleryPostBySlug(slug: string) {
  const res = await fetch(`${WP_BASE}/gallery_posts?slug=${slug}`);
  if (!res.ok) throw new Error("Failed to fetch gallery post");
  const data = await res.json();
  const gallery = data[0]; // WP always returns array
  
  if (!gallery) return null;
  
  // Extract and map meta_box data like getGalleryPosts does
  const metaBox = gallery.meta_box || {};
  const thumbnail = Array.isArray(metaBox.gallery_thumbnail) ? metaBox.gallery_thumbnail[0] : null;
  const landingImage = Array.isArray(metaBox.gallery_landing) ? metaBox.gallery_landing[0] : null;
  
  return {
    ...gallery,
    gallery_heading: metaBox.gallery_heading || "",
    gallery_subheading: metaBox.gallery_subheading || "",
    gallery_type: metaBox.gallery_type || "Wedding",
    gallery_date: metaBox.gallery_date || "",
    gallery_thumbnail_url: thumbnail?.full_url || thumbnail?.url || "",
    gallery_landing_url: landingImage?.full_url || landingImage?.url || "",
    gallery_images: metaBox.gallery_images || []
  };
}
