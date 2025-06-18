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

      <section></section>
    </>
  );
};

export default Homepage;
