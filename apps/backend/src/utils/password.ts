import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateVerificationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const hashVerificationCode = async (code: string): Promise<string> => {
  return bcrypt.hash(code, SALT_ROUNDS);
};

export const compareVerificationCode = async (
  code: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(code, hash);
};

export const generateResetToken = (): string => {
  // Generate a secure random token (32 bytes = 64 hex characters)
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const hashResetToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, SALT_ROUNDS);
};

export const compareResetToken = async (
  token: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(token, hash);
};
