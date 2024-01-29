import jwt from "jsonwebtoken";
export const signJWT = (email: string, id: string) => {
  const privkey = process.env.SECRET_JWT_KEY as string;
  const tok = jwt.sign({ email, id }, privkey, { expiresIn: "6h" });
  return tok;
};

export const decodeJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY as string);
    return decoded;
  } catch (err) {
    return null;
  }
};
