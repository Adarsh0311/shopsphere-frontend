export interface JwtAuthResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  email: string;
  userId: string;
  role: string; // Role as string instead of user object
}

