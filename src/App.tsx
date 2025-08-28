import { Route, Routes } from "react-router";

import Homepage from "./pages/Homepage";
import StatsPage from "./pages/StatsPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HiatusNotification from "./components/HiatusNotification";

const App = () => {
  const mode = import.meta.env.VITE_ENVIRONMENT;

  return (
    <>
      <Navbar />
      {/* {mode === "dev" && <HiatusNotification />} */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
