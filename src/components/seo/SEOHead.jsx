import { Helmet } from 'react-helmet-async';
import { useArtist } from '@/context/ArtistContext';
import { APP_NAME } from '@/constants';
import { buildJsonLd } from '@/utils/seo';

export default function SEOHead({ title, description, image, url, type, data }) {
  const { artist } = useArtist();
  const siteName = artist ? artist.stage_name || artist.name : APP_NAME;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const desc = description || artist?.bio || artist?.short_bio || 'Plataforma oficial de Cabaxx, artista urbano bogotano. Música, eventos, tienda y comunidad en un solo lugar, hecho en Bogotá D.C., Colombia.';
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
