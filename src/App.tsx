import { Route, Routes } from "react-router";

import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// import { spotifyAuth as spotifyAuthTest } from "./api/auth/spotifyAuth/spotifyAuth";
import spotify from "./api/spotify/spotify";
import { useEffect } from "react";

const App = () => {
  // const handleSpotifyAuth = async () => {
  //   await spotifyAuthTest();
  // };

  useEffect(() => {
    const check = async () => {
      sessionStorage.setItem("areWeLoggedIn", "" + await spotify.checkForAuth());
    }
    check()
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
