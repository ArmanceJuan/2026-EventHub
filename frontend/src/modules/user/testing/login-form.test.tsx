import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "../../store/store";
import { LoginForm } from "../components/login-form.component";

describe("LoginForm", () => {
  const store = createStore({ dependencies: {} });

  const renderLoginForm = () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );
  };

  it("affiche les champs et bouton désactivé au départ", () => {
    renderLoginForm();
    expect(screen.getByPlaceholderText(/armance@mail.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /se connecter/i })
    ).toBeDisabled();
  });

  it("active le bouton quand les champs sont remplis", async () => {
    renderLoginForm();
    await userEvent.type(
      screen.getByPlaceholderText(/armance@mail.com/i),
      "test@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText(/••••••••/i), "Valid12Char!");
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeEnabled();
  });

  it("affiche un message d'erreur si identifiants incorrects", async () => {
    renderLoginForm();
    await userEvent.type(
      screen.getByPlaceholderText(/armance@mail.com/i),
      "wrong@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText(/••••••••/i), "wrong");
    await userEvent.click(
      screen.getByRole("button", { name: /se connecter/i })
    );
    expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
  });
});
