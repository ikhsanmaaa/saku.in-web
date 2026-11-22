export type UserRole = 'USER' | 'ADMIN';

export interface UserResponse {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly phoneNumber: string | null;
  readonly role: UserRole;
}

export interface RegisterRequest {
  readonly username: string;
  readonly name: string;
  readonly email: string;
  readonly phoneNumber?: string;
  readonly password: string;
}

export interface LoginRequest {
  readonly username: string;
  readonly password: string;
}

export interface TokenResponse {
  readonly accessToken: string;
  readonly refreshToken?: string;
}

export interface RefreshRequest {
  readonly refreshToken: string;
}

export interface ChangePasswordRequest {
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly newConfirmPassword: string;
}
