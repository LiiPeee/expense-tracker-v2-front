import { signIn } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "./Auth";

vi.mock("@react-oauth/google", () => ({ GoogleLogin: () => null }));

vi.mock("@/services/auth", async () => {
  const actual = await vi.importActual<typeof import("@/services/auth")>("@/services/auth");
  return {
    ...actual,
    signIn: vi.fn(async () => ({ accessToken: "a", refreshToken: "r" })),
    signUp: vi.fn(async () => undefined),
    signInWithGoogle: vi.fn(async () => ({ accessToken: "a", refreshToken: "r" })),
  };
});

const mockedSignIn = vi.mocked(signIn);

function renderAuth() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Auth />
    </MemoryRouter>,
  );
}

function submitClosestForm(element: HTMLElement) {
  const form = element.closest("form");
  if (!form) throw new Error("Form not found");
  fireEvent.submit(form);
}

describe("Auth login form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks submit and shows an inline error for an invalid email", async () => {
    renderAuth();

    const email = screen.getByLabelText("Email");
    fireEvent.change(email, { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "secret" } });
    submitClosestForm(email);

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it("submits valid login credentials", async () => {
    renderAuth();

    const email = screen.getByLabelText("Email");
    fireEvent.change(email, { target: { value: "user@mail.com" } });
    fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "secret" } });
    submitClosestForm(email);

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith({ email: "user@mail.com", password: "secret" });
    });
  });
});
