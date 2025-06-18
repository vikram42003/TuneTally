import Hero from "../components/Homepage/Hero";

// image credits - https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco
// Photo by <a href="https://unsplash.com/@framesbyfin?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Heidi Fin</a> on <a href="https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

const Homepage = () => {
  return (
    <>
      <section className="bg-[url(/images/hero_bg.jpg)] bg-cover min-h-[80vh] py-4 flex items-center">
        <div className="layout-container mx-32 px-8">
          <Hero />
        </div>
      </section>

      <section className="bg-spotify-gray">
        <div className="layout-container grid grid-cols-1 md:grid-cols-2 text-center p-16 gap-8">
          <div>
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/2024-spotify-brand-assets-media-kit.jpg" alt="placeholder image of spotify written on top of green background" />
          </div>
          <div>2</div>
          <div>
            3
          </div>
          <div>
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/2024-spotify-brand-assets-media-kit.jpg" alt="placeholder image of spotify written on top of green background" />
          </div>
          <div>
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/2024-spotify-brand-assets-media-kit.jpg" alt="placeholder image of spotify written on top of green background" />
          </div>
          <div>6</div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
