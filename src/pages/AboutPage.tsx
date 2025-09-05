import { Link } from "react-router";

const AboutPage = () => {
  return (
    <section className="bg-spotify-gray">
      <div className="layout-container space-y-8 pt-16 pb-32 text-base">
        <h2 className="text-3xl font-bold underline text-spotify-green">About TuneTally</h2>

        <p>
          TuneTally is a web app that lets you explore your music listening habits. You can check your top artists,
          songs, favorite genres, and even your recently played tracks, all in one place!
        </p>

        <p>
          I built this app because I was curious about my own taste in music and wanted an easy way to see which songs
          and artists I’ve been playing the most. It started as a personal project to learn new tools and techonologies,
          and quickly grew into something I wanted to share.
        </p>

        <p>
          This project is not affiliated with Spotify. It’s just a hobby project built with React, Tailwind, AWS Lambda,
          and the Spotify API.
        </p>

        <p>
          Currently, this app supports only Spotify. However, it's built to be platform-agnostic, so support for Apple
          Music or YouTube Music may be added in the future.
        </p>

        <p>🎶 Think of it like a mini Spotify Wrapped you can access anytime!</p>

        <p className="text-sm">
          P.S. If you're a developer, you can check out the code{" "}
          <Link
            to="https://github.com/vikram42003/TuneTally"
            className="text-spotify-green hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </Link>
          .{" "}
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
