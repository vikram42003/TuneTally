# TuneTally

TuneTally is a music listening statistics app

Whats it is -
It will fetch data from a music listening website/api and show your music listening statistics like

- your top artists
- most listened songs
- how much more (or less) listening hours you have compared to other users
- will fetch the data securely and wont store any user credentials and will just redirect you to the actual spotify (or other) authentication pages

Whats the MVP -
just fetch your own data from spotify and print it to console or screen
then build all the other stuff on top of that

Will I use a backend -
probably not, since i dont want to save any user data for security reasons
But i might tho to just store the app related statistics like

- how many users have used this app until now
- how many total hours of music have been fetched and displayed by this app
- whats the average number of listening hours of this apps users

<br />
<br />
<br />

How PKCE works -

user (you)                           -    first entity  
TuneTally (or app or client)         -    second entity  
spotify (or some other music app)    -    third entity  

Imagine youre the user, you listen to music on spotify and you want to see your music listening stats
BUT you dont know how to do that, we'll in that case you can use an app like TuneTally to let it fetch your data

So normally, the interaction goes like this -
- the user goes to TuneTally and tells it to fetch their music listening data
- TuneTally does not know how to identify the user so it asks the user for their username/email and password
- the user provides the credentials and then TuneTally goes to Spotify, fetches the user data and presents it to them

The problem with this interaction -
- you're telling some unknown website your email and password, you dont really know if you can trust it or not
- once you give it your credentials they basically have your credentials forever, you can ask them to delete your data after use but they can just not do that and you have no way of knowing if they've deleted your data or not
- even if the app is trustable and does not misuse your data, if the app ever gets hacked then there goes your data

Now, there are many apps that do keep your data secure and have legally binding clauses that prevent them from misusing your data, despite that fact, as a user i'd prefer to be safe than sorry
And thats where PKCE comes in

The solution -
- Proof Key for Code Exchance or PKCE (pronounced pixy) is an extension of the Oauth2 authorization protocol which was designed to work with small scale apps like an SPA where we'd rather not store any sensitive information on our side
- with PKCE, we, as a user, dont store store any credentials with the client (TuneTally), instead we directly authenticate with the authorization server (Spotify) who gives us a special one time limited user credentials (like an OTP) which allows the client (TuneTally) to acces the resource that it needs to access

The interaction goes like this -
- the user goes to TuneTally and tells it to fetch their music listening data
- TuneTally tells the user that it does not know whose data to access and it does not have the permission to access the users data and then sends the user to the Spotify authentication page to confirm their identity
- before it sends the user to directly authenticate with spotify, it also gives them a unique string to pass onto spotify so that spotify knows what app is sending the request
- once the user authenticates, spotify gives them an authorization token with limited validity (like 1 hour) and permissions (like allowed to read liked songs only), which the user then gives to the client (TuneTally)
- now that the app has the authorization token, the app sends the authorization token AND the unique string it generated in step 3 when it needs to fetch the data
- when spotify receives the requests it
  - checks if the authorization token is the same one it gave out
  - checks if the unique string is the same as the one it received during authentication
- if everyting checks out then the client (TuneTally) is good to communicate with spotify untill validity expires or is revoken

With PKCE -
- the app does not receive any user credentials at all, all it receives is a token that allows it to access the data it needs to access for a limited time and with limited permissions
- since the app does not reveice any user credentials we dont need to trust the app with our credentials
- we are protected from cyber attacks since protecting your credentials is spotify's responsibility and with PKCE, attacks like man-in-the-middle cannot happen since we're confirming authorization tokens and unique strings in separate turns

DISCLAIMER - I know that this explanation might not be the most accurate but this is supposed to be a gist of how it works and why you can trust TuneTally, intended to be understood by the average person. If you're reading this and feel like this could use some improvement then I implore you to open an issue in issues tab or dm me to improve it or contribute to this project!


<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
``` -->
