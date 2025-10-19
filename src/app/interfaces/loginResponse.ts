import { User } from './user';

export interface LoginResponse {
  message: string;
  User: User;
  token: string;
}
