
import CryptoJS from 'crypto-js';

// It's better to store the salt separately or derive it, but for a simple offline app, a static salt is a starting point.
const SALT = 'deeply-super-secret-salt-that-is-static';
const KEY_SIZE = 256 / 32;
const ITERATIONS = 1000;

function deriveKey(password: string): string {
  // Use PBKDF2 to derive a more secure key from the user's password
  return CryptoJS.PBKDF2(password, SALT, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS
  }).toString();
}

/**
 * Encrypts a string using AES with a key derived from the password.
 * @param data The string to encrypt.
 * @param password The user's password.
 * @returns The encrypted string.
 */
export function encrypt(data: string, password: string): string {
  const key = deriveKey(password);
  return CryptoJS.AES.encrypt(data, key).toString();
}

/**
 * Decrypts an AES-encrypted string.
 * @param encryptedData The encrypted string.
 * @param password The user's password.
 * @returns The decrypted string, or null if decryption fails (e.g., wrong password).
 */
export function decrypt(encryptedData: string, password: string): string | null {
  try {
    const key = deriveKey(password);
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    // If decryption fails due to wrong password, decryptedData will be empty.
    if (!decryptedData) {
      return null;
    }
    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
