import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordField } from "../components/password-field.component";

describe("PasswordField", () => {
  it("affiche le label et le champ mot de passe", () => {
    render(<PasswordField label="Mot de passe" />);

    const input = screen.getByLabelText("Mot de passe");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("n'affiche aucune erreur quand le champ est vide", () => {
    render(<PasswordField label="Mot de passe" />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("affiche les erreurs seulement après que l'utilisateur quitte le champ", async () => {
    render(<PasswordField label="Mot de passe" />);
    const input = screen.getByLabelText("Mot de passe");

    await userEvent.type(input, "weak");

    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    fireEvent.blur(input);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/exactement 12 caractères/i)).toBeInTheDocument();
    expect(screen.getByText(/au moins une majuscule/i)).toBeInTheDocument();
    expect(screen.getByText(/au moins un chiffre/i)).toBeInTheDocument();
    expect(
      screen.getByText(/au moins un caractère spécial/i)
    ).toBeInTheDocument();
  });

  it("n'affiche aucune erreur quand le mot de passe est valide après blur", async () => {
    render(<PasswordField label="Mot de passe" />);
    const input = screen.getByLabelText("Mot de passe");

    await userEvent.type(input, "Valid12Char!");
    fireEvent.blur(input);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("cache/monte le mot de passe avec le bouton eye", async () => {
    render(<PasswordField label="Mot de passe" />);
    const input = screen.getByLabelText("Mot de passe");
    const toggleButton = screen.getByRole("button", {
      name: /afficher le mot de passe/i,
    });

    expect(input).toHaveAttribute("type", "password");

    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });
});
