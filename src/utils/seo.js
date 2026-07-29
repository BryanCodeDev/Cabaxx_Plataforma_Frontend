export function buildJsonLd(artist, type, data) {
  const base = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist?.stage_name || artist?.name || '',
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
