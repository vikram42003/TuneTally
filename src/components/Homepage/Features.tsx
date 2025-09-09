const Features = () => {
  return (
    <div>
      <div id="features" className="text-spotify-green pb-16 text-center text-3xl font-bold lg:text-4xl">
        Here's what you'll get
      </div>

      <div className="space-y-12 px-4 lg:space-y-16 lg:px-0 [&>*:nth-child(even)]:md:flex-row-reverse">
        <Feature
          src="/images/features_topArtists_topSongs_image.png"
          alt="placeholder image of spotify written on top of green background"
          title="🎤 Your Top Artists & Tracks"
          text="See which artists you’ve been playing on repeat and which songs define your listening habits. Choose 
          between 4 weeks, 6 months, or 1 year to explore your music journey."
        />

        <Feature
          src="/images/features_topGenres_image.png"
          alt="placeholder image of spotify written on top of green background"
          title="🎶 Discover Your Genres"
          text="From j-pop to rap to niche styles, see which genres make up your unique taste. Get a colorful 
          breakdown of the sounds that shape your playlists."
        />

        <Feature
          src="/images/features_recentlyPlayedSongs_image.png"
          alt="placeholder image of spotify written on top of green background"
          title="⏮️ Recently Played"
          text="Instantly revisit the tracks you just had on repeat. Perfect for finding that song you can’t 
          get out of your head."
        />
      </div>
    </div>
  );
};

interface FeatureProps {
  src: string;
  alt: string;
  title: string;
  text: string;
}

const Feature = ({ src, alt, title, text }: FeatureProps) => {
  return (
    <div className="mx-auto flex flex-col items-center justify-between gap-6 md:flex-row lg:flex-row lg:gap-16">
      <div className="flex-1/2">
        <img src={src} alt={alt} className="h-60 w-full rounded-2xl object-cover object-top lg:h-84" />
      </div>
      <div className="flex-1/2 text-base leading-relaxed lg:text-xl">
        <h4 className="text-spotify-green my-2 text-xl font-semibold lg:text-3xl">{title}</h4>
        {text}
      </div>
    </div>
  );
};

export default Features;
