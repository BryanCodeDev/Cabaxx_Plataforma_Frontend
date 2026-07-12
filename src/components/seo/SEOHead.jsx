import { Helmet } from 'react-helmet-async';
import { useArtist } from '@/context/ArtistContext';
import { APP_NAME } from '@/constants';

function buildJsonLd(artist, type, data) {
  const base = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist?.stage_name || artist?.name || APP_NAME,
    url: typeof window !== 'undefined' ? window.location.origin + '/' + (artist?.slug || '') : '',
  };

  if (!data) return base;

  if (type === 'song') {
    return {
      ...base,
      '@type': 'MusicRecording',
      name: data.title,
      image: data.cover_url,
      ...(data.duration_seconds ? { duration: `PT${Math.floor(data.duration_seconds / 60)}M${data.duration_seconds % 60}S` } : {}),
    };
  }

  if (type === 'event') {
    return {
      ...base,
      '@type': 'MusicEvent',
      name: data.title,
      description: data.description,
      location: {
        '@type': 'Place',
        name: data.venue_name || data.city,
        address: data.venue_address || data.city,
      },
      ...(data.start_datetime ? { startDate: data.start_datetime } : {}),
    };
  }

  if (type === 'post') {
    return {
      ...base,
      '@type': 'Article',
      headline: data.title,
      description: data.excerpt || (typeof data.content === 'string' ? data.content.slice(0, 200) : ''),
      image: data.cover_url,
      ...(data.published_at ? { datePublished: data.published_at } : {}),
    };
  }

  if (type === 'product') {
    return {
      ...base,
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.cover_url,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: data.currency || 'COP',
        availability: data.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    };
  }

  return base;
}

export default function SEOHead({ title, description, image, url, type, data }) {
  const { artist } = useArtist();
  const siteName = artist ? artist.stage_name || artist.name : APP_NAME;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const desc = description || artist?.bio || artist?.short_bio || 'Plataforma oficial de Cabaxx. Música, eventos, tienda y comunidad en un solo lugar.';
  const ogImage = image || artist?.seo?.og_image_url || artist?.banner_url || '';
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const jsonLd = buildJsonLd(artist, type, data);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type === 'song' ? 'music.song' : type === 'event' ? 'event' : 'website'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
