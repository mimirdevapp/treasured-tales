import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  canonical?: string;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title = 'The Treasured Tales - Premium Wedding & Event Photography',
  description = 'Premium wedding photography and event coverage by Adithya D Ullal. Artistic storytelling and elegant composition. Serving clients across India.',
  keywords = 'thetreasuredtales, wedding photography, event photography, Adithya D Ullal, The Treasured Tales, professional photographer, wedding photographer',
  image = 'https://thetreasuredtales.com/og-image.png',
  url = 'https://thetreasuredtales.com',
  type = 'website',
  author = 'Adithya D Ullal',
  canonical = 'https://thetreasuredtales.com',
  children
}) => {
  const fullTitle = title.includes('The Treasured Tales') ? title : `${title} | The Treasured Tales`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="The Treasured Tales" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Additional meta tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="30 days" />
      
      {children}
    </Helmet>
  );
};

export default SEO;
