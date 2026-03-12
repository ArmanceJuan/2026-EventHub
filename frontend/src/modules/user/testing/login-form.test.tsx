import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../../store/auth-context.provider";
import { LoginForm } from "../components/login-form.component";

describe("LoginForm", () => {
  const renderLoginForm = () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
  };

  it("affiche les champs et bouton désactivé au départ", () => {
    renderLoginForm();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /se connecter/i })
    ).toBeDisabled();
  });

  it("active le bouton quand les champs sont remplis", async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "Valid12Char!");
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeEnabled();
  });

  it("affiche un message d'erreur si identifiants incorrects", async () => {
    renderLoginForm();
    await userEvent.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "wrong");
    await userEvent.click(
      screen.getByRole("button", { name: /se connecter/i })
    );
    expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
  });
});
