import axios from "axios";
// import { redirectAndGetCodeFromSpotify, getAccessToken } from "./pkce";

// const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// const loginUrl = import.meta.env.VITE_LAMBDA_LOGIN_URL;

// The different permission we ask from user for reading their data
// go to https://developer.spotify.com/documentation/web-api/concepts/scopes for details
// const scope = "user-read-private user-read-email user-top-read";

// The login process follows OAuth2 so just change the url to initiate the process
const apiSpotifyBaseUrl = import.meta.env.VITE_LAMBDA_SPOTIFY_BASE_URL;
export const loginWithSpotify = () => {
  window.location.href = apiSpotifyBaseUrl + "/spotifyLogin";
};

export const testRequestNew = async () => {
  const start = Date.now();
  const res = await axios.get(apiSpotifyBaseUrl + "/spotify/me/top/artists", { withCredentials: true });
  const end = Date.now();
  console.log(`Request took ${end - start} ms`);
  console.log(res);
};

















// export const checkSpotifyAuthStatus = async (): Promise<void> => {
//   // Make the app flow based on auth status
//   const status: string | null = sessionStorage.getItem("spotifyAuthenticationStatus");

//   // If status is null then this is a fresh session so do nothing
//   if (!status) {
//     return;
//   } else if (status === "pending") {
//     // This means we have made a request to get code from spotify/authorization endpoint and now we need to send it to lambda
//     // to exchange it for the access token
//     // Handle the 3 possibilities here (todo.md -> TODO FR FR 2.1, 2.2, 2.3)
//     const params = new URLSearchParams(window.location.search);
//     const code: string | null = params.get("code");
//     const state: string | null = params.get("state");

//     // Check if code and state are there
//     if (!code || !state) {
//       console.log("Code or State are missing");
//       // FOR TESTING --- FOR TESTING --- FOR TESTING
//       console.log(`Code - ${code}\nState - ${state}`);
//       return;
//     }

//     // Check if state matches the state we saved. This should match unless XSS happens or we mess up in a really rare way
//     if (state !== sessionStorage.getItem("state")) {
//       console.log("Saved state and returned state do not match");
//       return;
//     }

//     // Start the authentication flow to exchange code for access token
//     // Also show a "Loading" popup at this step
//     try {
//       await getAccessToken(clientId, code);
//       await testRequestNew();
//     } catch (e: unknown) {
//       console.log(e);
//     }
//   } else if (status === "authenticated") {
//     // This means we have the access token but we need to verify it
//     // redirect the user to the stats page, it will verify it and show an error if something is wrong
//   } else {
//     // https://knowyourmeme.com/memes/ref-do-something
//     console.log("DO SOMETHING REF spotifyAuthenticationStatus BE WILDING\n", "status - ", status);
//   }
// };

// export const startSpotifyAuth = (): void => {
//   sessionStorage.setItem("spotifyAuthenticationStatus", "pending");
//   // No need to await here since the page will redirect
//   redirectAndGetCodeFromSpotify(clientId, scope, lambdaApiUrl);
// };

// export const spotifyAuth1 = async () => {
//   // check the authentication status that we have/will store
//   const spotifyAuthenticationStatus = sessionStorage.getItem("spotifyAuthenticationStatus");

//   if (!spotifyAuthenticationStatus) {
//     console.log("TRIGGERING CONDITION 1");
//     // If we dont find it then that means we're starting fresh
//     // await redirectAndGetCodeFromSpotify(clientId, scope);
//   } else if (spotifyAuthenticationStatus === "pending") {
//     // TODO
//     console.log("TRIGGERING CONDITION 2");
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get("code");
//     if (!code) {
//       console.log("Code aint there my guy");
//       return;
//     }
//     const accessToken = await getAccessToken(clientId, code);
//     console.log("accessToken", accessToken);
//     sessionStorage.setItem("accessToken", accessToken);
//     sessionStorage.removeItem("state");
//     sessionStorage.setItem("spotifyAuthenticationStatus", "finished");
//   } else {
//     console.log("TRIGGERING CONDITION 3");
//     const accessToken = sessionStorage.getItem("accessToken");
//     if (!accessToken) {
//       console.log("Access Token aint there my guy");
//       return;
//     }
//     const response = await testRequest(accessToken);
//     console.log("Response: ", response);
//     // await checkAccessToken();
//   }
// };

// const checkAccessToken = async (): Promise<boolean> => {
//   // TODO - remove the spotifyAuthenticationStatus and state variables from session storage incase the access token check fails
//   // so that the user can start anew or we can just start authentication then and there

//   try {
//     await axios.get("https://api.spotify.com/v1/users/smedjan");
//   } catch (error) {
//     console.log("Some error occured in checkAccessToken");
//     console.log(error);
//     return false;
//   }

//   return true;
// };

// const testRequest = async (accessToken: string) => {
//   const url = "https://api.spotify.com/v1/me/top/artists";
//   return await axios.get(url, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };
