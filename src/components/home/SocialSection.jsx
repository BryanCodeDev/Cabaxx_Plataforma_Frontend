import { useArtist } from '@/hooks/useArtist';

const PLATFORMS = [
  { key: 'spotify', label: 'Spotify', color: 'bg-[#1DB954]' },
  { key: 'instagram', label: 'Instagram', color: 'bg-gradient-to-br from-[#f09b4a] to-[#d62976]' },
  { key: 'youtube', label: 'YouTube', color: 'bg-red-600' },
  { key: 'tiktok', label: 'TikTok', color: 'bg-black' },
  { key: 'facebook', label: 'Facebook', color: 'bg-[#1877F2]' },
];

export default function SocialSection() {
  const { artist } = useArtist();
  const socials = artist?.social_links || [];

  return (
    <section className="border-y border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold">Conecta</p>
        <h2 className="mt-2 text-center font-display text-2xl text-text-primary sm:text-3xl">Sígueme</h2>

        <div className="mt-8 flex flex-wrap justify-center gap-5 sm:mt-10 sm:gap-8">
          {PLATFORMS.map((p) => {
            const link = socials.find((s) => s.platform?.toLowerCase() === p.key);
            if (!link) return null;
            return (
              <a
                key={p.key}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 transition"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.color} text-white shadow-lg transition group-hover:scale-110 group-hover:shadow-glow sm:h-16 sm:w-16`}
                >
                  <span className="font-display text-xl">{p.label[0]}</span>
                </div>
                <span className="text-xs text-text-secondary">{p.label}</span>
                {/* Only show a follower count when the backend actually provides one */}
                {link.follower_count != null && (
                  <span className="font-mono text-xs text-text-muted">
                    {link.follower_count >= 1_000_000
                      ? `${(link.follower_count / 1_000_000).toFixed(1)}M`
                      : link.follower_count.toLocaleString('es-CO')}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}