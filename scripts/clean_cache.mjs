import fs from 'fs';
import path from 'path';

const nextDir = path.resolve('.next');
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('Successfully cleared stale .next cache directory.');
} else {
  console.log('.next directory does not exist.');
}
