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
      <hr />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>

    // <>
    //   <button
    //     type="button"
    //     className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
    //     onClick={handleSpotifyAuth}
    //   >
    //     Get Stats
    //   </button>
    // </>
  );
};

export default App;
