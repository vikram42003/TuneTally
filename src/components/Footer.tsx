const Footer = () => {
  const mode = import.meta.env.VITE_ENVIRONMENT;

  return (
    <section className="bg-spotify-dark">
      <div className="layout-container py-8 text-center">
        {mode === "dev" ? (
          ""
        ) : (
          <>
            "The app only stores auth token, profile data, top songs and top artists for caching purposes, but
            everything gets auto deleted after a duration of 1 hour."
            <br />
          </>
        )}

        Data is provided by Spotify AB but TuneTally is not related to Spotify AB or any of it's partners in any way
        <br />
        
        Made with ❤️ by{" "}
        <a href="https://github.com/vikram42003" target="_blank" className="text-blue-400 visited:text-purple-400">
          me!
        </a>
      </div>
    </section>
  );
};

export default Footer;
