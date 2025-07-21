
import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// The path to the db.json file
const dbPath = path.join(process.cwd(), 'db.json');

// Helper function to read the database
async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, return an empty object
      return {};
    }
    throw error;
  }
}

// Helper function to write to the database
async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// GET handler to retrieve data for a specific key
export async function GET(
  request: Request,
  {params}: {params: {key: string}}
) {
  const key = params.key;
  if (!key) {
    return NextResponse.json({error: 'Key is required'}, {status: 400});
  }

  const db = await readDb();
  const value = db[key] || null;

  return NextResponse.json({value});
}

// POST handler to save data for a specific key
export async function POST(
  request: Request,
  {params}: {params: {key: string}}
) {
  const key = params.key;
  if (!key) {
    return NextResponse.json({error: 'Key is required'}, {status: 400});
  }

  try {
    const {value} = await request.json();
    const db = await readDb();
    db[key] = value;
    await writeDb(db);

    return NextResponse.json({success: true, key, value});
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      {error: 'Failed to save data'},
      {status: 500}
    );
  }
}
