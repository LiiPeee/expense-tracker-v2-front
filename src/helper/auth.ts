import { getPasswordStrength, isStrongPassword } from "@/components/ui/password-strength";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("validation:emailInvalid"),
  password: z.string().min(1, "validation:passwordRequired"),
});

// Signup: reuses the live-indicator strength rule so the schema is the single gate (backend enforces it too).
export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "validation:nameRequired"),
  lastName: z.string().trim().min(1, "validation:lastNameRequired"),
  email: z.string().email("validation:emailInvalid"),
  password: z.string().refine((value) => isStrongPassword(getPasswordStrength(value)), "validation:passwordStrength"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("validation:emailInvalid"),
});
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

// Shared by both 6-digit code steps (reset-code and email verification).
export const verificationCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "validation:codeSixDigits"),
});
export type VerificationCodeForm = z.infer<typeof verificationCodeSchema>;

export const newPasswordSchema = z
  .object({
    password: z.string().refine((value) => isStrongPassword(getPasswordStrength(value)), "validation:passwordStrength"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "validation:passwordsMismatch",
  });
export type NewPasswordForm = z.infer<typeof newPasswordSchema>;

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
