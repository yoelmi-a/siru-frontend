import { User } from "./user.interface";

export interface AuthResponse {
  token:                        string;
  accessTokenDurationInMinutes: number;
  user:                         User;
}
