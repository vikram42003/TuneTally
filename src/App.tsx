import { useEffect } from "react";
import { auth } from "./api/auth/auth";

const App = () => {
  useEffect(() => {
    auth()
  }, [])

  return <>Hello World</>;
};

export default App;
