import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const avatarsDir = path.join(process.cwd(), 'public/avatars');
  fs.readdir(avatarsDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Error reading avatars directory' });
      return;
    }
    const avatarFiles = files.filter(file => file.endsWith('.png'));
    if (avatarFiles.length === 0) {
      res.status(404).json({ error: 'No avatars found' });
      return;
    }
    const randomAvatar = avatarFiles[Math.floor(Math.random() * avatarFiles.length)];
    res.status(200).json({ avatar: `/avatars/${randomAvatar}` });
  });
}