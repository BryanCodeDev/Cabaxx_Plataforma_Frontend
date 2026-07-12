import HeroSection from '@/components/home/HeroSection';
import LatestReleaseSection from '@/components/home/LatestReleaseSection';
import FeaturedSongsSection from '@/components/home/FeaturedSongsSection';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
import AboutSection from '@/components/home/AboutSection';
import GalleryPreviewSection from '@/components/home/GalleryPreviewSection';
import MerchandiseSection from '@/components/home/MerchandiseSection';
import NewsSection from '@/components/home/NewsSection';
import SocialSection from '@/components/home/SocialSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { useArtist } from '@/hooks/useArtist';

export default function HomePage() {
  const { artist } = useArtist();

  return (
    <div>
      <HeroSection artist={artist} />
      <LatestReleaseSection />
      <FeaturedSongsSection />
      <UpcomingEventsSection />
      <AboutSection />
      <GalleryPreviewSection />
      <MerchandiseSection />
      <NewsSection />
      <SocialSection />
      <NewsletterSection />
    </div>
  );
}
