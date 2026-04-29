export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface VerifyTokenRequest {
  id: string;
  token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
