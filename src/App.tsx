import { Route, Routes } from "react-router";

import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { useEffect } from "react";
import { checkSpotifyAuthStatus } from "./api/auth/spotifyAuth/spotifyAuth";

const App = () => {
  // useEffect(() => {
  //   // checkSpotifyAuthStatus checks and controls the authentication flow for Spotify
  //   checkSpotifyAuthStatus();
  // }, []);

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
