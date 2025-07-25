

const Hero = () => {
  const getStats = () => {
    console.log("WE ARE ABOUT TO GET TO WORK!!!!");
  };

  return (
    <div>
      <h2 className="text-6xl font-bold">
        Get your <span className="text-spotify-green">stats</span>
      </h2>

      <p className="py-2 text-lg font-semibold">
        Uncover your top <span className="text-spotify-green">songs</span>,{" "}
        <span className="text-spotify-green">genres</span>, and <span className="text-spotify-green">artists</span>.
      </p>

      <div>
        <button
          type="button"
          onClick={getStats}
          // shadow-[0_0_20px_rgba(29,185,84,0.6)] does the green glow effect
          className="bg-spotify-green cursor-pointer rounded-4xl px-6 py-2 font-bold text-black shadow-[0_0_20px_rgba(29,185,84,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(29,185,84,0.9)]"
        >
          Login with Spotify
        </button>
        {/* Arrow icon link - Put this in credits in about page */}
        {/* <a target="_blank" href="https://icons8.com/icon/Ek7khsXSeZ71/arrow">Arrow</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
        <img className="ml-4 inline -scale-125" src="/icons/arrow-icon.png" alt="icon of an arrow" />
      </div>
    </div>
  );
};

export default Hero;
