
import { NextResponse } from 'next/server';
import { getDbData, setDbData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const key = params.key;
  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    const data = await getDbData(key);
    // If data is undefined, return null or an empty array based on convention
    return NextResponse.json(data ?? null);
  } catch (error) {
    console.error(`Failed to read data for key: ${key}`, error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { key:string } }
) {
  const key = params.key;
  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  try {
    const value = await request.json();
    await setDbData(key, value);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to write data for key: ${key}`, error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
