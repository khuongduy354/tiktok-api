import "dotenv/config";
const config = {
  routes: {
    login: false as any,
  },
  secret: process.env.SECRET_KEY,
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUE_BASE_URL,
};
export default config;
