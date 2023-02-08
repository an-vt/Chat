import config from "config";
import { get, omit } from "lodash";
import { LeanDocument } from "mongoose";
import { UserDocument } from "../model/user.model";
import { decode, sign } from "../utils/jwt.utils";
import { findUser } from "./user.service";

export function createAccessToken(
  user:
    | Omit<UserDocument, "password">
    | LeanDocument<Omit<UserDocument, "password">>
) {
  // Build and return the new access token
  const accessToken = sign(
    { ...user },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
}

export async function reIssueAccessToken(refreshToken: string) {
  // Decode the refresh token
  const { decoded, expired } = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  // Make sure the session is still valid
  if (expired) return false;

  const user: LeanDocument<UserDocument> | null = await findUser({
    _id: get(decoded, "_id"),
  });

  if (!user) return false;

  const accessToken = createAccessToken(omit(user, "password"));

  return accessToken;
}
