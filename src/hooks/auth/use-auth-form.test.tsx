import { forgotPassword, validateResetCode } from "@/services/auth";
import { act, renderHook } from "@testing-library/react";
import { useAuthForm } from "./use-auth-form";

const mockNavigate = vi.fn();
const mockToast = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "user-id" }),
  useSearchParams: () => [new URLSearchParams("email=dev@test.com")],
}));

vi.mock("../use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/services/auth", () => ({
  forgotPassword: vi.fn(),
  logOut: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
  validateResetCode: vi.fn(),
  verifyToken: vi.fn(),
}));

describe("useAuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("block forgot password with invalid email", async () => {
    const { result } = renderHook(() => useAuthForm());

    act(() => {
      result.current.setEmail("bad-email");
    });

    await act(async () => {
      await result.current.handleForgotPassword();
    });

    expect(forgotPassword).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Email inválido",
        variant: "destructive",
      }),
    );
  });

  it("trim code before send", async () => {
    const { result } = renderHook(() => useAuthForm());
    const event = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.setCode("  123456  ");
    });

    await act(async () => {
      await result.current.handleSendCode(event);
    });

    expect(validateResetCode).toHaveBeenCalledWith({
      email: "dev@test.com",
      code: "123456",
    });
  });
});
