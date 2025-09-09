import { useState } from "react";
import SpotifyButton from "./SpotifyButton";
import { loginWithSpotify } from "../api/auth/spotifyAuth/spotifyAuth";

const HiatusNotification = () => {
  const [showDetails, setShowDetails] = useState(false);

  const collapsedText = (
    <>
      On May 15th 2025, Spotify made the decision to restrict access to their API. Now only organizations with 250,000
      or more monthly users are allowed the full use of the Spotify API. Which basically means that independent projects
      like this one, can run with limited features only. So this app is live in demo mode for now
    </>
  );

  const fullText = (
    <>
      On May 15th 2025, Spotify made the decision to restrict their Extended Quota Mode in their API. Now only
      organizations that fulfil this criteria -
      <ul className="list-disc pl-5">
        <li>Be from a registered business entity</li>
        <li>Already be publicly live </li>
        <li>Have ≥250,000 monthly active users</li>
        <li>Operate within key Spotify markets</li>
        <li>Show commercial viability</li>
      </ul>
      Are allowed to apply for Extended Quota Mode, effectively killing indipendent projects. So this app is live but
      with limited functionality until changes to the api are made or a workaround is found.
      <br />
      (Extended Qouta Mode is the public mode for the spotify api, which can be be called by any user, as opposed to the
      Developer Mode, which requires you to manually add spotify registered emails of upto 25 emails of people who can
      call the api)
      <br />
      <br />
      The app now uses a demo account as a permanently logged in spotify account. And on clicking on the "Login with
      Spotify" button, It fetches a new access token with its pre saved refresh token through OAuth2, And then fetches
      the data for the demo user.
      <br />
      If you, the visitor, really want, I can manually add your spotify email to my apps developer dashboard whitelist
      so that you can use this app for real. Email me at vikramjit360@gmail.com with the keywords "TUNENTALLY - SUPER
      DUPER IMPORTANT" in the title and your spotify registered email somewhere in the body and I'll add your email and
      send you back a confirmation email! Use this special login button to log in with your own account if you've been
      whitelisted
      <br />
      <SpotifyButton
        text="Login with Spotify"
        handler={loginWithSpotify}
        className="my-2 bg-amber-400! px-4! py-1! text-sm!"
      />
    </>
  );

  return (
    <section className="bg-dartmouth-green text-xs lg:text-sm">
      <div className="layout-container py-2 lg:py-4">
        {showDetails ? fullText : collapsedText}
        <br />

        <button className="cursor-pointer font-extrabold hover:underline" onClick={() => setShowDetails((s) => !s)}>
          show {showDetails ? "less" : "more"}
        </button>
      </div>
    </section>
  );
};

export default HiatusNotification;
