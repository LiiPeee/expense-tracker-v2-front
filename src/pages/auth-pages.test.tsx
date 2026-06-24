import { forgotPassword, validateResetCode, verifyToken } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import NewPassword from "./NewPassword";
import ResetCode from "./ResetCode";
import VerifyTokenEmail from "./VerifyTokenEmail";

vi.mock("@/services/auth", async () => {
  const actual = await vi.importActual<typeof import("@/services/auth")>("@/services/auth");
  return {
    ...actual,
    forgotPassword: vi.fn(async () => undefined),
    validateResetCode: vi.fn(async () => undefined),
    verifyToken: vi.fn(async () => undefined),
    resetPassword: vi.fn(async () => undefined),
  };
});

const mockedForgotPassword = vi.mocked(forgotPassword);
const mockedValidateResetCode = vi.mocked(validateResetCode);
const mockedVerifyToken = vi.mocked(verifyToken);

describe("auth pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ForgotPassword submits and navigates to reset code route", async () => {
    render(
      <MemoryRouter
        initialEntries={["/forgot-password"]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-code" element={<ResetCode />} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByLabelText("Email");
    fireEvent.change(input, { target: { value: "new@mail.com" } });
    const form = input.closest("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedForgotPassword).toHaveBeenCalledWith("new@mail.com");
    });

    expect(await screen.findByText("Inserir Código")).toBeInTheDocument();
  });

  it("ResetCode sends code and navigates to new password route", async () => {
    render(
      <MemoryRouter
        initialEntries={["/reset-code?email=dev@mail.com"]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/reset-code" element={<ResetCode />} />
          <Route path="/new-password" element={<NewPassword />} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByLabelText("Código de verificação");
    fireEvent.change(input, { target: { value: "123456" } });
    const form = input.closest("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedValidateResetCode).toHaveBeenCalledWith({
        email: "dev@mail.com",
        token: "123456",
      });
    });

    expect(await screen.findByText("Nova Senha")).toBeInTheDocument();
  });

  it("ForgotPassword blocks submit and shows an inline error for an invalid email", async () => {
    render(
      <MemoryRouter initialEntries={["/forgot-password"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByLabelText("Email");
    fireEvent.change(input, { target: { value: "not-an-email" } });
    const form = input.closest("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
    expect(mockedForgotPassword).not.toHaveBeenCalled();
  });

  it("ResetCode blocks submit and shows an inline error for a short code", async () => {
    render(
      <MemoryRouter initialEntries={["/reset-code?email=dev@mail.com"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/reset-code" element={<ResetCode />} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByLabelText("Código de verificação");
    fireEvent.change(input, { target: { value: "123" } });
    const form = input.closest("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    expect(await screen.findByText("O código deve ter 6 dígitos")).toBeInTheDocument();
    expect(mockedValidateResetCode).not.toHaveBeenCalled();
  });

  it("VerifyTokenEmail verifies token and navigates to auth route", async () => {
    render(
      <MemoryRouter
        initialEntries={["/verify-email/user-123"]}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/verify-email/:id" element={<VerifyTokenEmail />} />
          <Route path="/auth" element={<div>PAGINA AUTH</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByLabelText("Código de verificação");
    fireEvent.change(input, { target: { value: "123456" } });
    const form = input.closest("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedVerifyToken).toHaveBeenCalledWith({
        id: "user-123",
        token: "123456",
      });
    });

    expect(await screen.findByText("PAGINA AUTH")).toBeInTheDocument();
  });
});
