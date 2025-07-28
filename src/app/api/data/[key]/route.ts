
import { NextResponse, type NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb() {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, create it with an empty object
            await fs.writeFile(dbPath, '{}', 'utf8');
            return {};
        }
        console.error("Error reading database file:", error);
        throw new Error("Could not read database.");
    }
}

async function writeDb(data: any) {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing to database file:", error);
        throw new Error("Could not write to database.");
    }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;
    if (!key) {
        return NextResponse.json({ message: "Key is required" }, { status: 400 });
    }
    const db = await readDb();
    const data = db[key];

    if (data === undefined) {
        return NextResponse.json({ message: "Data not found for this key" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
    try {
        const key = params.key;
        if (!key) {
            return NextResponse.json({ message: "Key is required" }, { status: 400 });
        }
        
        const body = await request.json();
        const dataToSave = body.data;

        if (dataToSave === undefined) {
            return NextResponse.json({ message: "Data is required in the request body" }, { status: 400 });
        }
        
        const db = await readDb();
        db[key] = dataToSave;
        await writeDb(db);
        
        return NextResponse.json({ message: "Data saved successfully" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
