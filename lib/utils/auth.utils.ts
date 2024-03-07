import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a password with its hash to check for a match.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A boolean indicating whether the passwords match.
 */
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
