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
      <div className="my-3 rounded bg-gray-800 p-6 text-center text-sm lg:my-5 lg:p-10 lg:text-base">
        <div className="py-2">
          <span className="text-spotify-green font-semibold">Could not load {componentName + " :("}</span>
          <br />
          {errorText}
        </div>
        <SpotifyButton
          handler={loginWithSpotifyRefreshTokenDEMO}
          text="Login with Spotify"
          className="px-4! py-1! lg:px-6! lg:py-2!"
        />
      </div>
    </>
  );
};

export default StatsPageErrorComponent;
