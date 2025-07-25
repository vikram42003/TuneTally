import { Route, Routes } from "react-router";

import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// import { spotifyAuth as spotifyAuthTest } from "./api/auth/spotifyAuth/spotifyAuth";
import { useEffect } from "react";

const App = () => {
  // const handleSpotifyAuth = async () => {
  //   await spotifyAuthTest();
  // };

  useEffect(() => {
    // Make the app flow based on auth status
    const status: string | null = sessionStorage.getItem("spotifyAuthenticationStatus");

    // If status is null then this is a fresh session so do nothing
    if (!status) {
      return
    } else if (status === "pending") {
      // This means we have made a request to get code from spotify/authorization endpoint and now we need to send it to lambda
      // to exchange it for the access token
      // Handle the 3 possibilities here (todo.md -> TODO FR FR 2.1, 2.2, 2.3) 

    } else if (status === "authenticated") {
      // This means we have the access token but we need to verify it
      // redirect the user to the stats page, it will verify it and show an error if something is wrong
    }
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
