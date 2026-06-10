export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateResetCodeRequest {
  email: string;
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
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
  // O backend (TokenResponseDto) retorna apenas accessToken/refreshToken; não envia user.
  refreshToken?: string;
}
