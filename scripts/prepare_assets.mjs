import fs from 'fs';
import path from 'path';

const userUploadsDir = 'C:\\Users\\bhave\\.gemini\\antigravity-ide\\brain\\e2b30965-52ce-41f7-8c65-e6d865547d97\\.user_uploaded';
const targetDir = path.resolve('public/assets');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = [
  { src: 'media_1790012214451.png', dest: 'logo.png' },
  { src: 'media_1790012630221.png', dest: 'y2k-stars.png' },
  { src: 'media_1790012674865.png', dest: 'y2k-tribal.png' },
];

for (const item of files) {
  const srcPath = path.join(userUploadsDir, item.src);
  const destPath = path.join(targetDir, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${item.src} -> ${destPath}`);
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
}
