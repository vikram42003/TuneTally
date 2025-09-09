import { loginWithSpotifyRefreshTokenDEMO } from "../../api/auth/spotifyAuth/spotifyAuth";
import SpotifyButton from "../SpotifyButton";

const Hero = () => {
  return (
    <div>
      <h2 className="text-4xl font-bold lg:text-6xl">
        Get your <span className="text-spotify-green">stats</span>
      </h2>

      <p className="py-2 text-lg font-semibold">
        Uncover your top <span className="text-spotify-green">songs</span>,{" "}
        <span className="text-spotify-green">genres</span>, and <span className="text-spotify-green">artists</span>.
      </p>

      <div>
        <SpotifyButton handler={loginWithSpotifyRefreshTokenDEMO} text="Login with Spotify" />

        {/* Arrow icon link - Put this in credits in about page */}
        {/* <a target="_blank" href="https://icons8.com/icon/Ek7khsXSeZ71/arrow">Arrow</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
        <img className="ml-4 inline -scale-125" src="/icons/arrow-icon.png" alt="icon of an arrow" />
      </div>
    </div>
  );
};

export default Hero;
