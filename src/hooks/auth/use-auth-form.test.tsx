import { forgotPassword, validateResetCode } from "@/services/auth";
import { act, renderHook } from "@testing-library/react";
import { useAuthForm } from "./use-auth-form";

const mockNavigate = vi.fn();
const mockToast = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "user-id" }),
  useSearchParams: () => [new URLSearchParams("email=dev@test.com")],
  useLocation: () => ({ pathname: "/reset-code", state: null }),
}));

vi.mock("../use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/services/auth", () => ({
  forgotPassword: vi.fn(async () => undefined),
  logOut: vi.fn(),
  signIn: vi.fn(),
  signInWithGoogle: vi.fn(),
  signUp: vi.fn(),
  resetPassword: vi.fn(async () => undefined),
  validateResetCode: vi.fn(async () => undefined),
  verifyToken: vi.fn(),
}));

describe("useAuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the recovery email and navigates to the reset-code route", async () => {
    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      await result.current.handleForgotPassword("user@mail.com");
    });

    expect(forgotPassword).toHaveBeenCalledWith("user@mail.com");
    expect(mockNavigate).toHaveBeenCalledWith("/reset-code?email=user%40mail.com");
  });

  it("validates the code against the email from the query string", async () => {
    const { result } = renderHook(() => useAuthForm());

    await act(async () => {
      await result.current.handleSendCode("123456");
    });

    expect(validateResetCode).toHaveBeenCalledWith({ email: "dev@test.com", token: "123456" });
    expect(mockNavigate).toHaveBeenCalledWith("/new-password", { state: { email: "dev@test.com", code: "123456" } });
  });
});
