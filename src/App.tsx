import { useEffect } from "react";
import { auth } from "./api/auth/spotifyAuth/spotifyAuth";

const App = () => {
  useEffect(() => {
    auth();
  }, []);

  return <>Hello World</>;
};

export default App;
