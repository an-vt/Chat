import config from "config";
import { Request, Response } from "express";
import { get, omit } from "lodash";
import User from "../model/user.model";
import { createAccessToken, reIssueAccessToken } from "../service/auth.service";
import { validatePassword } from "../service/user.service";
import { decode, sign } from "../utils/jwt.utils";

export async function login(req: Request, res: Response) {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // create access token
  const accessToken = createAccessToken(user);

  // create refresh token
  const refreshToken = sign(user, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken });
}

export async function refreshTokenAuthen(req: Request, res: Response) {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  // verify token
  const { decoded, expired } = decode(accessToken);
  const user = await User.findOne({ email: get(decoded, "email") });

  if (expired || !decoded || !user) {
    return res.status(401).send("Invalid Token");
  }

  const newAccessToken = await reIssueAccessToken(accessToken);
  // create refresh token
  const refreshToken = sign(omit(user.toJSON(), "password"), {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.send({ accessToken: newAccessToken, refreshToken });
}
