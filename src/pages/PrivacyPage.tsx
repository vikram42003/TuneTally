import { Link } from "react-router";

const PrivacyPage = () => {
  return (
    <section className="bg-spotify-gray">
      <div className="layout-container space-y-8 pt-16 pb-32 text-base">
        <h2 className="text-3xl font-bold underline text-spotify-green">Privacy Policy</h2>

        <p>
          TuneTally uses your Spotify account only to fetch your music listening data (like your top artists, songs,
          genres, profile, and recently played tracks).
        </p>

        <ul className="list-disc space-y-1 pl-5">
          <li>Your data is temporarily cached on our server to improve performance.</li>
          <li>Cached data is automatically deleted within 1 hour, when your session expires.</li>
          <li>No permanent accounts or long-term storage are created.</li>
          <li>
            Authentication is handled securely through Spotify. This app only works as an intermediary that initiates
            authentication and fetches and presents data.
          </li>
          <li>
            You can revoke access at any time from your{"  "}
            <Link
              to="https://www.spotify.com/account/apps/"
              className="text-spotify-green hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify account settings
            </Link>
            .
          </li>
          <li>We do not sell or share your data with anyone.</li>
          <li>
            If you are a developer and have any doubts, you can look at the source code{"  "}
            <Link
              to="https://github.com/vikram42003/TuneTally"
              className="text-spotify-green hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </li>
        </ul>

        <p>This project is not affiliated with Spotify.</p>
      </div>
    </section>
  );
};

export default PrivacyPage;
