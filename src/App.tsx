import { Route, Routes } from "react-router";

import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HiatusNotification from "./components/HiatusNotification";

import { useEffect } from "react";
import { checkSpotifyAuthStatus } from "./api/auth/spotifyAuth/spotifyAuth";

const App = () => {
  const mode = import.meta.env.VITE_ENVIRONMENT
  // useEffect(() => {
  //   // checkSpotifyAuthStatus checks and controls the authentication flow for Spotify
  //   checkSpotifyAuthStatus();
  // }, []);

  return (
    <>
      <Navbar />
      {mode === "dev" && <HiatusNotification />}
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
