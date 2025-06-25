import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const projectRoot = process.cwd();

// List of files/directories to exclude from the output
const EXCLUDED_PATHS = new Set([
  'node_modules',
  '.next',
  '.git',
  'package-lock.json',
  '.env',
  '.env.local',
  'db.json', // Avoid exposing the user data file
  'public', // Exclude public folder if it contains large assets
  path.join('src', 'app', 'api', 'get-all-files', 'route.ts').replace(/\\/g, '/'),
]);

async function getProjectFiles(dir: string): Promise<Record<string, string>> {
  let filesMap: Record<string, string> = {};
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');

    if (EXCLUDED_PATHS.has(entry.name) || EXCLUDED_PATHS.has(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      const nestedFiles = await getProjectFiles(fullPath);
      filesMap = { ...filesMap, ...nestedFiles };
    } else {
      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        filesMap[relativePath] = content;
      } catch (err) {
        // It might be a binary file or unreadable, skip it.
      }
    }
  }
  return filesMap;
}

export async function GET() {
  try {
    const allFiles = await getProjectFiles(projectRoot);
    return NextResponse.json(allFiles);
  } catch (error) {
    console.error('Failed to get project files:', error);
    return NextResponse.json({ error: 'Failed to retrieve project files' }, { status: 500 });
  }
}
