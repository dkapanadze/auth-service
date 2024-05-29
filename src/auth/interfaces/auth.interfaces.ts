import { Request } from 'express';
import { BaseUser } from 'src/users/interfaces';

export interface RequestWithUser<T extends BaseUser | OAuthUserResponse>
  extends Request {
  user: T;
}

export interface OAuthUserResponse {
  readonly accessToken: AuthTokenResponse;
  readonly refreshToken: AuthTokenResponse;
  readonly user: BaseUser;
}
export interface JWTPayload {
  userId: number;
}

export type AuthTokenResponse = { cookie: string; token: string };
