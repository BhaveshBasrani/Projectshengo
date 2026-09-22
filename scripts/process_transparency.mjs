import fs from 'fs';
import path from 'path';

async function processImages() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.error('Sharp not available yet:', e);
    return;
  }

  const assetsDir = path.resolve('public/assets');

  // 1. Process Stars: Remove White Background
  try {
    const starsPath = path.join(assetsDir, 'y2k-stars.png');
    if (fs.existsSync(starsPath)) {
      const { data, info } = await sharp(starsPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const { width, height, channels } = info;
      
      for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If close to white
        const brightness = (r + g + b) / 3;
        if (brightness > 235) {
          data[i + 3] = 0; // Transparent
        } else if (brightness > 200) {
          // Feather edge
          const factor = (235 - brightness) / 35;
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }

      await sharp(data, { raw: { width, height, channels } })
        .png()
        .toFile(path.join(assetsDir, 'stars-transparent.png'));
      console.log('Created stars-transparent.png');
    }
  } catch (err) {
    console.error('Error processing stars:', err);
  }

  // 2. Process Tribal Flowers: Remove Black Background
  try {
    const tribalPath = path.join(assetsDir, 'y2k-tribal.png');
    if (fs.existsSync(tribalPath)) {
      const { data, info } = await sharp(tribalPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const { width, height, channels } = info;

      for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxVal = Math.max(r, g, b);
        
        if (maxVal < 15) {
          data[i + 3] = 0;
        } else if (maxVal < 45) {
          const factor = (maxVal - 15) / 30;
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }

      await sharp(data, { raw: { width, height, channels } })
        .png()
        .toFile(path.join(assetsDir, 'tribal-transparent.png'));
      console.log('Created tribal-transparent.png');
    }
  } catch (err) {
    console.error('Error processing tribal:', err);
  }

  // 3. Process Logo: Circle mask or dark background cutout
  try {
    const logoPath = path.join(assetsDir, 'logo.png');
    if (fs.existsSync(logoPath)) {
      const { data, info } = await sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const { width, height, channels } = info;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.485;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * channels;
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          if (dist > radius + 3) {
            data[idx + 3] = 0; // Cut out outside of circular emblem
          } else if (dist > radius) {
            const factor = 1 - (dist - radius) / 3;
            data[idx + 3] = Math.round(data[idx + 3] * Math.max(0, factor));
          }
        }
      }

      await sharp(data, { raw: { width, height, channels } })
        .png()
        .toFile(path.join(assetsDir, 'logo-transparent.png'));
      console.log('Created logo-transparent.png');
    }
  } catch (err) {
    console.error('Error processing logo:', err);
  }
}

processImages();
