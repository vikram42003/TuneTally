import Features from "../components/Homepage/Features";
import Hero from "../components/Homepage/Hero";

// hero_bg image credits - https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco
// Photo by <a href="https://unsplash.com/@framesbyfin?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Heidi Fin</a> on <a href="https://unsplash.com/photos/white-and-black-ipad-H4fYXZ1hyco?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

const Homepage = () => {
  // Css is being super weird here, if I add anything with bg-cover, the background position gets hard locked to 
  // something and cannot be changed to anything even with imporant flag, I dont know if its because of tailwind 
  // or css or the picture size
  let bgCss = "bg-right";
  // Default is mobile, then check for desktop
  if (window.innerWidth > 1024) {
    bgCss = "bg-cover bg-center";
  }

  return (
    <>
      <section className={`flex min-h-[60vh] items-center bg-[url(/images/hero_bg.jpg)] py-4 lg:min-h-[80vh] ${bgCss}`}>
        <div className="layout-container w-full">
          <Hero />
        </div>
      </section>

      <section className="bg-spotify-gray">
        <div className="layout-container py-24 md:px-24">
          <Features />
        </div>
      </section>
    </>
  );
};

export default Homepage;
