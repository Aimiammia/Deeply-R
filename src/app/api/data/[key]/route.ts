// This API route has been deprecated as the app now uses a local-first storage approach.
// The file is kept to avoid breaking build processes but is no longer used.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'This API is deprecated.' }, { status: 410 });
}
export async function POST() {
  return NextResponse.json({ error: 'This API is deprecated.' }, { status: 410 });
}
