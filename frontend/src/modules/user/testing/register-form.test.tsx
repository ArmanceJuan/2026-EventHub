import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { RegisterForm } from "../components/register-form.component";
import { AuthProvider } from "../../store/auth-context.provider";

describe("RegisterForm", () => {
  const renderRegisterForm = () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it("affiche tous les champs et le bouton désactivé au départ", () => {
    renderRegisterForm();

    expect(screen.getByPlaceholderText(/armance@mail.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min\. 6 caractères/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirmer le mot de passe/i)).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /créer mon compte/i });
    expect(submitButton).toBeDisabled();
  });

  it("active le bouton seulement quand tous les champs sont valides", async () => {
    renderRegisterForm();
    const submitButton = screen.getByRole("button", { name: /créer mon compte/i });

    await userEvent.type(
      screen.getByPlaceholderText(/armance@mail.com/i),
      "marie.dupont@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/min\. 6 caractères/i),
      "Valid12Char!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirmer le mot de passe/i),
      "Valid12Char!"
    );

    fireEvent.blur(screen.getByPlaceholderText(/min\. 6 caractères/i));
    fireEvent.blur(screen.getByPlaceholderText(/confirmer le mot de passe/i));

    expect(submitButton).toBeEnabled();
  });

  it("affiche un message de succès après soumission valide et stocke dans le store", async () => {
    renderRegisterForm();

    await userEvent.type(
      screen.getByPlaceholderText(/armance@mail.com/i),
      "jean.martin@test.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/min\. 6 caractères/i),
      "Super12Pass!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirmer le mot de passe/i),
      "Super12Pass!"
    );

    fireEvent.blur(screen.getByPlaceholderText(/min\. 6 caractères/i));
    fireEvent.blur(screen.getByPlaceholderText(/confirmer le mot de passe/i));

    await userEvent.click(
      screen.getByRole("button", { name: /créer mon compte/i })
    );

    expect(screen.queryByText(/inscription impossible/i)).not.toBeInTheDocument();
  });

  it("n'affiche pas de message de succès si les mots de passe ne correspondent pas", async () => {
    renderRegisterForm();

    await userEvent.type(screen.getByPlaceholderText(/armance@mail.com/i), "paul@test.com");
    await userEvent.type(
      screen.getByPlaceholderText(/min\. 6 caractères/i),
      "Valid12Char!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirmer le mot de passe/i),
      "Different123!"
    );

    fireEvent.blur(screen.getByPlaceholderText(/confirmer le mot de passe/i));

    await userEvent.click(
      screen.getByRole("button", { name: /créer mon compte/i })
    );

    expect(screen.queryByText(/inscription impossible/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/les mots de passe ne correspondent pas/i)
    ).toBeInTheDocument();
  });
});
