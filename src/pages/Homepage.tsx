import Features from "../components/Homepage/Features";
import Hero from "../components/Homepage/Hero";

// hero_bg image credits - https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco
// Photo by <a href="https://unsplash.com/@framesbyfin?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Heidi Fin</a> on <a href="https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

const Homepage = () => {
  return (
    <>
      <section className="flex min-h-[80vh] items-center bg-[url(/images/hero_bg.jpg)] bg-cover py-4">
        <div className="layout-container w-full">
          <Hero />
        </div>
      </section>

      <section className="bg-spotify-gray">
        <div className="layout-container py-24 md:px-24 ">
          <Features />
        </div>
      </section>
    </>
  );
};

export default Homepage;
