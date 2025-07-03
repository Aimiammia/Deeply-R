
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
  let fileContent: string;
  try {
    fileContent = await fs.readFile(dbPath, 'utf-8');
  } catch (error) {
    // If the file doesn't exist, create it and return an empty object.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try {
        await fs.writeFile(dbPath, JSON.stringify({}, null, 2), 'utf-8');
        return {};
      } catch (writeError) {
        console.error(`Failed to create db.json at ${dbPath}:`, writeError);
        // Throw a new, more specific error if creation fails.
        throw new Error(`Failed to create database file.`);
      }
    }
    // For other reading errors, re-throw to be handled by the caller.
    console.error(`Error reading db.json at ${dbPath}.`, error);
    throw error;
  }

  // Handle case where file is empty.
  if (fileContent.trim() === '') {
    return {};
  }

  try {
    // Try to parse the file content.
    return JSON.parse(fileContent);
  } catch (parseError) {
    console.error(`Error parsing db.json at ${dbPath}. The file might be corrupted.`, parseError);
    // Throw an error if parsing fails, to prevent data loss on subsequent writes.
    throw new Error(`Database file is corrupted.`);
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
