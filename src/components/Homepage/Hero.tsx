import { useEffect, useState } from "react";

const rotatingText = [
  "your top artist",
  "your top song",
  "your top genre",
  "your listening trends",
  "how many hours you listened",
];

const RotatingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingText.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="font-semibold text-purple-500 transition-all duration-500">
      {rotatingText[index]}
    </div>
  ) 
};

const Hero = () => {
  return (
    <div className="max-w-xl">
      <h2 className="text-5xl font-bold">
        Get your <span className="text-spotify-green">stats</span>
      </h2>

      <p className="text-lg py-2">
        Get answers to your most burning questions like <RotatingText />
      </p>

      <div>
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Get Stats
        </button>
      </div>
    </div>
  );
};

export default Hero;
