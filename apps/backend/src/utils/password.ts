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
