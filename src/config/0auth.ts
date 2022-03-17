import "dotenv/config";
const config = {
  routes: {
    login: false as any,
  },
  secret: process.env.SECRET_KEY,
  authRequired: false,
  auth0Logout: true,
  baseURL: "http://localhost:8000/",
  clientID: "tv01V8oHYjAa5J02yulrxgqbW6pQsjTz",
  issuerBaseURL: "https://dev-w0h5e8st.jp.auth0.com",
};
export default config;
