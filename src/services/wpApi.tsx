export const WP_API_URL = import.meta.env.VITE_WP_BASE;
const WP_BASE = `${WP_API_URL}/wp-json/wp/v2`;

let heroSlidesCache: any[] | null = null;

export async function getHeroSlides() {
  if (heroSlidesCache) return heroSlidesCache;
  const res = await fetch(`${WP_API_URL}/wp-json/tt/v1/slide-show`);
  if (!res.ok) {
    throw new Error("Failed to fetch hero slides");
  }

  const data = await res.json();
  const slideImages = data.slides.map((slide: any) => ({
    featured_media_url: slide.image_1536 || slide.image_full,
  }));

  heroSlidesCache = slideImages;
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
        featured_media_url: img?.sizes["1536x1536"].url || img.full_url || ""
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

    const testimonialNumbers = Object.keys(metaBox)
      .filter(key => key.startsWith("testimonial_title_"))
      .map(key => key.replace("testimonial_title_", ""));

    testimonialNumbers.forEach((num) => {
      const couple = metaBox[`testimonial_title_${num}`] || "";
      const quote = metaBox[`testimonial_description_${num}`] || "";
      const imageArr = metaBox[`testimonial_image_${num}`] || [];
      const imageObj = Array.isArray(imageArr) ? imageArr[0] : null;
      const image = imageObj?.sizes["1536x1536"].url || imageObj?.full_url || "";

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
  const res = await fetch(`${WP_API_URL}/wp-json/tt/v1/gallery_posts_list`);
  if (!res.ok) throw new Error("Failed to fetch gallery posts");
  const galleries = await res.json();
  
  // Map galleries with extracted data from meta_box
  const galleriesWithImages = galleries.map((gallery: any) => {
    
    return {
      ...gallery,
      gallery_heading: gallery.gallery_heading || "",
      gallery_type: gallery.gallery_type || "Wedding",
      gallery_date: gallery.gallery_date || "",
      gallery_thumbnail_url: gallery.gallery_thumbnail_url || "",
    };
  });
  
  return galleriesWithImages;
}

export async function getGalleryPostBySlug(slug: string) {
  const res = await fetch(`${WP_API_URL}/wp-json/tt/v1/gallery_posts?slug=${slug}`);
  if (!res.ok) throw new Error("Failed to fetch gallery post");
  const gallery = await res.json();
  if (!gallery) return null;
  
  return {
    ...gallery,
    gallery_heading: gallery.gallery_heading || "",
    gallery_subheading: gallery.gallery_subheading || "",
    gallery_type: gallery.gallery_type || "Wedding",
    gallery_date: gallery.gallery_date || "",
    gallery_landing_image: gallery?.gallery_landing_image[0] || "",
    gallery_images: gallery?.gallery_images || []
  };
}

