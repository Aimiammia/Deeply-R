
import fs from 'fs/promises';
import path from 'path';

// Define the path to the db.json file at the root of the project.
const dbPath = path.join(process.cwd(), 'db.json');

// Interface for the database structure.
// It's a good practice to have a defined shape, even if using `any`.
interface DbData {
  [key: string]: any;
}

// Function to ensure the database file exists and read its content.
async function readDb(): Promise<DbData> {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist, create it with an empty object.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(dbPath, JSON.stringify({}, null, 2), 'utf-8');
      return {};
    }
    // For other errors (like invalid JSON), log it and return an empty object.
    console.error('Error reading db.json:', error);
    return {};
  }
}

// Function to write data to the database file.
async function writeDb(data: DbData): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
}

/**
 * Gets a value for a specific key from the database file.
 * @param key The key of the data to retrieve.
 * @returns The data associated with the key, or undefined if not found.
 */
export async function getDbData(key: string): Promise<any> {
  const db = await readDb();
  return db[key];
}

/**
 * Sets a value for a specific key in the database file.
 * @param key The key of the data to set.
 * @param value The value to store.
 */
export async function setDbData(key: string, value: any): Promise<void> {
  const db = await readDb();
  db[key] = value;
  await writeDb(db);
}
