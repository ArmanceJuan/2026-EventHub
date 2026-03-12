import { validatePassword } from "../components/password-validator.util";

describe("Validation du mot de passe", () => {
  it("doit accepter un mot de passe de exactement 12 caractères", () => {
    expect(validatePassword("Exact12Char!")).toBe(true);
  });

  it("doit rejeter un mot de passe de moins de 12 caractères", () => {
    expect(validatePassword("Ab1!short")).toBe(false);
  });

  it("doit rejeter un mot de passe de plus de 12 caractères", () => {
    expect(validatePassword("WayTooLongPwd!1")).toBe(false);
  });

  it("doit contenir au moins une majuscule", () => {
    expect(validatePassword("exact12char!")).toBe(false);
    expect(validatePassword("Exact12char!")).toBe(true);
  });

  it("doit contenir au moins une minuscule", () => {
    expect(validatePassword("EXACT12CHAR!")).toBe(false);
    expect(validatePassword("eXACT12CHAR!")).toBe(true);
  });

  it("doit contenir au moins un chiffre", () => {
    expect(validatePassword("ExactChar!!")).toBe(false);
    expect(validatePassword("Exact12Char!")).toBe(true);
  });

  it("doit contenir au moins un caractère spécial", () => {
    expect(validatePassword("Exact12Char1")).toBe(false);
    expect(validatePassword("Exact12Char!")).toBe(true);
  });

  it("doit valider un mot de passe respectant toutes les règles", () => {
    expect(validatePassword("Valid12Char!")).toBe(true);
  });

  it("doit rejeter un mot de passe qui ne respecte pas plusieurs règles", () => {
    expect(validatePassword("weak")).toBe(false);
  });
});
