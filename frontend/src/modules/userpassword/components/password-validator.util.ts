export const validatePassword = (password: string): boolean => {
  if (password.length !== 12) return false;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()\-_+=[\]{}|;:'",.<>?/`~]/.test(password);
  return hasUppercase && hasLowercase && hasDigit && hasSpecial;
};
