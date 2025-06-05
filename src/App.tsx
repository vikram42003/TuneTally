import { Route, Routes } from "react-router";

// import { spotifyAuth as spotifyAuthTest } from "./api/auth/spotifyAuth/spotifyAuth";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";

const App = () => {
  // const handleSpotifyAuth = async () => {
  //   await spotifyAuthTest();
  // };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  );
};

export default App;
