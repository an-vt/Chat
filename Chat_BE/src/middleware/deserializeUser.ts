import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { decode } from "../utils/jwt.utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) {
    return res.status(403).send("A token is required for authentication");
  }

  const { decoded, expired } = decode(accessToken);

  if (expired || !decoded) {
    return res.status(401).send("Invalid Token");
  }

  if (decoded) {
    // @ts-ignore
    req.user = decoded;

    return next();
  }

  return next();
};

export default deserializeUser;
