const Hero = () => {
  return (
    <div className="min-h-[70vh] flex gap-[6rem] items-center">
      <div className="basis-[45%] bg-blue-600 opacity-80">
        <h2>Get your stats</h2>
        
        <div>
          Get answers to your most burning questions like (rotate between these)[your top artist, your top song, your
          top genre etc]
        </div>

        <div>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Get Stats
          </button>
        </div>
      </div>

      <div className="basis-[55%] bg-red-600 opacity-80">image</div>
    </div>
  );
};

export default Hero;
