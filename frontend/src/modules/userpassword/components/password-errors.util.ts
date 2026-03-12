export const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length !== 12) {
    errors.push("Le mot de passe doit contenir exactement 12 caractères");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  }

  if (!/\d/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }

  if (!/[!@#$%^&*()\-_+=[\]{}|;:'",.<>?/`~]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  }

  return errors;
};
