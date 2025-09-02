import { useState } from "react";
import { Route, Routes, useSearchParams } from "react-router";

import Homepage from "./pages/Homepage";
import StatsPage from "./pages/StatsPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HiatusNotification from "./components/HiatusNotification";
import ErrorNotification from "./components/ErrorNotification";

const App = () => {
  const [errorText, setErrorText] = useState<string | null>("WE HAVE AN ERROR");
  const [params] = useSearchParams()

  if ("error" in params && "error_message" in params) {
    setErrorText(`Error: ${params.error}\n${params.error_message}`);
    setTimeout(() => setErrorText(null), 5000)
  }
  
  const mode = import.meta.env.VITE_ENVIRONMENT;

  return (
    <>
      <ErrorNotification text={errorText}/>
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
