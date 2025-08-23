import { loginWithSpotify } from "../api/auth/spotifyAuth/spotifyAuth";
import Hero from "../components/Homepage/Hero";

// hero_bg image credits - https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco
// Photo by <a href="https://unsplash.com/@framesbyfin?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Heidi Fin</a> on <a href="https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

const Homepage = () => {
  const handleGetStats = () => {
    loginWithSpotify();
  };

  return (
    <>
      <section className="flex min-h-[80vh] items-center bg-[url(/images/hero_bg.jpg)] bg-cover py-4">
        <div className="layout-container w-full">
          <Hero handleGetStats={handleGetStats} />
        </div>
      </section>

      {/* PS. Features should be about telling the user why they should click the "get stats" button, dont 
      add unnecessary stuff here, even images should only be added if they grab attention and feel in-place */}
      <section className="bg-spotify-gray">
        <div className="layout-container grid grid-cols-1 gap-8 py-16 text-center md:grid-cols-2">
          <div>
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/2024-spotify-brand-assets-media-kit.jpg"
              alt="placeholder image of spotify written on top of green background"
            />
          </div>
          <div>2</div>
          <div>3</div>
          <div>
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/2024-spotify-brand-assets-media-kit.jpg"
              alt="placeholder image of spotify written on top of green background"
            />
          </div>
          <div>
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/2024-spotify-brand-assets-media-kit.jpg"
              alt="placeholder image of spotify written on top of green background"
            />
          </div>
          <div>6</div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
