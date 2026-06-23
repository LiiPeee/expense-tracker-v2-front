import { getPasswordStrength, isStrongPassword } from "@/components/ui/password-strength";
import { z } from "zod";

// Login: email format + password presence (no strength rule on login).
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Signup: reuses the live-indicator strength rule so the schema is the single gate (backend enforces it too).
export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "Nome é obrigatório"),
  lastName: z.string().trim().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().refine((value) => isStrongPassword(getPasswordStrength(value)), "A senha não atende todos os requisitos de segurança"),
});

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
  // Reset code from the email — the backend revalidates it before changing the password.
  token: string;
}

export interface VerifyTokenRequest {
  id: string;
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
