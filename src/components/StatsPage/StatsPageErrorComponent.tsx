import { loginWithSpotify } from "../../api/auth/spotifyAuth/spotifyAuth";
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
    <div className="my-5 rounded bg-gray-800 p-10 text-center">
      <div className="py-2">
        <span className="text-spotify-green font-semibold">Could not load {componentName + " :("}</span>
        <br />
        {errorText}
      </div>
      <SpotifyButton handler={loginWithSpotify} text="Login with Spotify" />
    </div>
    </>
  );
};

export default StatsPageErrorComponent;
