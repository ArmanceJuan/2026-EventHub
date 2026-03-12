export type UserRole = "PARTICIPANT" | "ORGANIZER" | "ADMIN";

export interface RegisterDTO {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
  otpCode?: string;
  backupCode?: string;
}

export interface UserPayload {
  id: string;
  role: UserRole;
  email: string;
}
