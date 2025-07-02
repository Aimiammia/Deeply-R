
import fs from 'fs/promises';
import path from 'path';

// Define the path to the db.json file at the root of the project.
const dbPath = path.join(process.cwd(), 'db.json');
const tempDbPath = path.join(process.cwd(), 'db.json.tmp');

// Interface for the database structure.
// It's a good practice to have a defined shape, even if using `any`.
interface DbData {
  [key: string]: any;
}

// Function to ensure the database file exists and read its content.
async function readDb(): Promise<DbData> {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    // Handle empty file, which is not valid JSON
    if (fileContent.trim() === '') {
        return {};
    }
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist, try to create it.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try {
        await fs.writeFile(dbPath, JSON.stringify({}, null, 2), 'utf-8');
        return {};
      } catch (writeError) {
        // If creating the file fails, log the error and return an empty object to prevent a server crash.
        console.error(`Failed to create db.json at ${dbPath}:`, writeError);
        return {};
      }
    }
    // For other read/parse errors, log it and return an empty object.
    console.error(`Error reading or parsing db.json at ${dbPath}. Returning empty object.`, error);
    return {};
  }
}

// Function to write data to the database file atomically to prevent corruption.
async function writeDb(data: DbData): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    // 1. Write the new content to a temporary file
    await fs.writeFile(tempDbPath, jsonString, 'utf-8');
    // 2. Atomically rename the temporary file to the final destination
    await fs.rename(tempDbPath, dbPath);
  } catch (error) {
    console.error(`Atomic write to db.json failed. Path: ${dbPath}`, error);
    // Attempt to clean up the temporary file if it exists, but don't let it hide the original error.
    try {
      await fs.unlink(tempDbPath);
    } catch (cleanupError) {
      // Log cleanup error but don't throw, the original error is more important
      console.error('Failed to cleanup temp db file:', cleanupError);
    }
    // Re-throw the original error so the caller knows the write failed
    throw error;
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
  // This can now throw an error, which will be caught by the API route handler
  await writeDb(db);
}
