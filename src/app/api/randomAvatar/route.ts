import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const avatarsDir = path.join(process.cwd(), 'public/avatars');
    const files = await fs.readdir(avatarsDir);
    
    const avatarFiles = files.filter(file => file.endsWith('.png'));
    if (avatarFiles.length === 0) {
      return NextResponse.json({ error: 'No avatars found' }, { status: 404 });
    }
    
    const randomAvatar = avatarFiles[Math.floor(Math.random() * avatarFiles.length)];
    return NextResponse.json({ avatar: `/avatars/${randomAvatar}` });
  } catch (error) {
    console.error('Error in randomAvatar:', error);
    return NextResponse.json({ error: 'Error reading avatars directory' }, { status: 500 });
  }
}