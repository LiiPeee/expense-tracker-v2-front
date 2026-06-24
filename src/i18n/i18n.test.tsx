import i18n from "@/i18n";
import Auth from "@/pages/Auth";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@react-oauth/google", () => ({ GoogleLogin: () => null }));

describe("i18n language switching", () => {
  afterEach(async () => {
    await i18n.changeLanguage("pt-BR");
  });

  it("renders Portuguese by default and re-renders when the language changes", async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Auth />
      </MemoryRouter>,
    );

    expect(screen.getByText("Bem-vindo")).toBeInTheDocument();

    await act(async () => {
      await i18n.changeLanguage("en");
    });
    expect(screen.getByText("Welcome")).toBeInTheDocument();

    await act(async () => {
      await i18n.changeLanguage("es");
    });
    expect(screen.getByText("Bienvenido")).toBeInTheDocument();
  });
});
