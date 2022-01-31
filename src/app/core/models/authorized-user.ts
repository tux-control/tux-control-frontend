import { User } from './user';

export interface AuthorizedUser {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: Date | null;
  refreshTokenExpires: Date | null;
  user: User;
}
