import { loginWithSpotifyRefreshTokenDEMO } from "../../api/auth/spotifyAuth/spotifyAuth";
import SpotifyButton from "../SpotifyButton";

interface StatsPageErrorComponentProps {
  componentName?: string;
  errorText?: string;
}

const StatsPageErrorComponent = ({
  componentName = "this component",
  errorText = "Something went wrong, please try logging in again",
}: StatsPageErrorComponentProps) => {
  return (
    <>
      <div className="lg:my-5 my-3 rounded bg-gray-800 lg:p-10 p-6 text-center lg:text-base text-sm">
        <div className="py-2">
          <span className="text-spotify-green font-semibold">Could not load {componentName + " :("}</span>
          <br />
          {errorText}
        </div>
        <SpotifyButton handler={loginWithSpotifyRefreshTokenDEMO} text="Login with Spotify" className="lg:px-6! px-4! lg:py-2! py-1!" />
      </div>
    </>
  );
};

export default StatsPageErrorComponent;
