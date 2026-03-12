import { getPasswordErrors } from "../components/password-errors.util";

describe("Messages d'erreur du mot de passe", () => {
  it("retourne un tableau vide pour un mot de passe valide", () => {
    expect(getPasswordErrors("Valid12Char!")).toEqual([]);
  });

  it("indique l'erreur de longueur si pas exactement 12 caractères", () => {
    const errorsShort = getPasswordErrors("Ab1!");
    const errorsLong = getPasswordErrors("WayTooLongPassword!");

    expect(errorsShort).toContain(
      "Le mot de passe doit contenir exactement 12 caractères"
    );
    expect(errorsLong).toContain(
      "Le mot de passe doit contenir exactement 12 caractères"
    );
  });

  it("indique l'absence de majuscule", () => {
    const errors = getPasswordErrors("exact12char!1");
    expect(errors).toContain(
      "Le mot de passe doit contenir au moins une majuscule"
    );
  });

  it("indique l'absence de minuscule", () => {
    const errors = getPasswordErrors("EXACT12CHAR!1");
    expect(errors).toContain(
      "Le mot de passe doit contenir au moins une minuscule"
    );
  });

  it("indique l'absence de chiffre", () => {
    const errors = getPasswordErrors("ExactChar!!!");
    expect(errors).toContain(
      "Le mot de passe doit contenir au moins un chiffre"
    );
  });

  it("indique l'absence de caractère spécial", () => {
    const errors = getPasswordErrors("Exact12Char1");
    expect(errors).toContain(
      "Le mot de passe doit contenir au moins un caractère spécial"
    );
  });

  it("retourne plusieurs erreurs si nécessaire", () => {
    const errors = getPasswordErrors("weak");
    expect(errors.length).toBeGreaterThan(1);
    expect(errors).toContain(
      "Le mot de passe doit contenir exactement 12 caractères"
    );
    expect(errors).toContain(
      "Le mot de passe doit contenir au moins une majuscule"
    );
  });
});
