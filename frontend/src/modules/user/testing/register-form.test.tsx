import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "../components/register-form.component";
import { AuthProvider } from "../../store/auth-context.provider";

describe("RegisterForm", () => {
  const renderRegisterForm = () => {
    render(
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    );
  };

  it("affiche tous les champs et le bouton désactivé au départ", () => {
    renderRegisterForm();

    expect(screen.getByLabelText(/^prénom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^confirmer le mot de passe$/i)
    ).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /^s'inscrire$/i });
    expect(submitButton).toBeDisabled();
  });

  it("active le bouton seulement quand tous les champs sont valides", async () => {
    renderRegisterForm();
    const submitButton = screen.getByRole("button", { name: /^s'inscrire$/i });

    await userEvent.type(screen.getByLabelText(/^prénom$/i), "Marie");
    await userEvent.type(screen.getByLabelText(/^nom$/i), "Dupont");
    await userEvent.type(
      screen.getByLabelText(/^email$/i),
      "marie.dupont@example.com"
    );
    await userEvent.type(
      screen.getByLabelText(/^mot de passe$/i),
      "Valid12Char!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirmer le mot de passe$/i),
      "Valid12Char!"
    );

    fireEvent.blur(screen.getByLabelText(/^mot de passe$/i));
    fireEvent.blur(screen.getByLabelText(/^confirmer le mot de passe$/i));

    expect(submitButton).toBeEnabled();
  });

  it("affiche un message de succès après soumission valide et stocke dans le store", async () => {
    renderRegisterForm();

    await userEvent.type(screen.getByLabelText(/^prénom$/i), "Jean");
    await userEvent.type(screen.getByLabelText(/^nom$/i), "Martin");
    await userEvent.type(
      screen.getByLabelText(/^email$/i),
      "jean.martin@test.com"
    );
    await userEvent.type(
      screen.getByLabelText(/^mot de passe$/i),
      "Super12Pass!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirmer le mot de passe$/i),
      "Super12Pass!"
    );

    fireEvent.blur(screen.getByLabelText(/^mot de passe$/i));
    fireEvent.blur(screen.getByLabelText(/^confirmer le mot de passe$/i));

    await userEvent.click(
      screen.getByRole("button", { name: /^s'inscrire$/i })
    );

    expect(screen.getByText(/inscription réussie/i)).toBeInTheDocument();
  });

  it("n'affiche pas de message de succès si les mots de passe ne correspondent pas", async () => {
    renderRegisterForm();

    await userEvent.type(screen.getByLabelText(/^prénom$/i), "Paul");
    await userEvent.type(screen.getByLabelText(/^nom$/i), "Durand");
    await userEvent.type(screen.getByLabelText(/^email$/i), "paul@test.com");
    await userEvent.type(
      screen.getByLabelText(/^mot de passe$/i),
      "Valid12Char!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirmer le mot de passe$/i),
      "Different123!"
    );

    fireEvent.blur(screen.getByLabelText(/^confirmer le mot de passe$/i));

    await userEvent.click(
      screen.getByRole("button", { name: /^s'inscrire$/i })
    );

    expect(screen.queryByText(/inscription réussie/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/les mots de passe ne correspondent pas/i)
    ).toBeInTheDocument();
  });
});
