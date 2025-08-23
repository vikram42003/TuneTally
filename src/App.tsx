import { Route, Routes, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Homepage from "./pages/Homepage";
import StatsPage from "./pages/StatsPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HiatusNotification from "./components/HiatusNotification";

import { getProfileData } from "./api/spotify/spotify";

const App = () => {
  const mode = import.meta.env.VITE_ENVIRONMENT;

  return (
    <>
      <Navbar />
      {mode === "dev" && <HiatusNotification />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
