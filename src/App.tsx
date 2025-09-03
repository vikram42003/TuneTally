import { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router";

import Homepage from "./pages/Homepage";
import StatsPage from "./pages/StatsPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HiatusNotification from "./components/HiatusNotification";
import ErrorNotification from "./components/ErrorNotification";
import { isJson } from "./utils/utils";
import { logoutSpotify } from "./api/auth/spotifyAuth/spotifyAuth";

const App = () => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [params] = useSearchParams();

  useEffect(() => {
    const error = params.get("error");
    let error_message = params.get("error_message");

    if (error) {
      if (error_message && isJson(error_message)) {
        console.log(error_message);
        error_message = "please try refreshing or logging in again";
      }

      sessionStorage.removeItem("sessionExpiry");
      logoutSpotify();
      setErrorText(`${error}: ${error_message}`);
      setTimeout(() => setErrorText(null), 5000);
    }
  }, [params]);

  const mode = import.meta.env.VITE_ENVIRONMENT;

  return (
    <>
      <ErrorNotification text={errorText} />
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
