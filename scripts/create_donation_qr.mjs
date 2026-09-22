import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svg = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#0A0A0A" rx="16" />
  <rect x="12" y="12" width="376" height="376" fill="#141414" stroke="#E50914" stroke-width="4" rx="8" />
  
  <!-- Header -->
  <text x="200" y="55" fill="#E50914" font-family="'JetBrains Mono', monospace" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="2">PROJECT S.H.E. NGO</text>
  <text x="200" y="80" fill="#A3A3A3" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="1">OFFICIAL RELIEF &amp; LEGAL AID FUND</text>
  
  <!-- QR Box Container -->
  <rect x="60" y="100" width="280" height="230" fill="#FFFFFF" stroke="#000000" stroke-width="4" rx="4" />
  
  <!-- QR Mock Pattern (Brutalist blocks) -->
  <!-- Top Left Corner -->
  <rect x="80" y="120" width="60" height="60" fill="#000000" />
  <rect x="90" y="130" width="40" height="40" fill="#FFFFFF" />
  <rect x="100" y="140" width="20" height="20" fill="#E50914" />
  
  <!-- Top Right Corner -->
  <rect x="260" y="120" width="60" height="60" fill="#000000" />
  <rect x="270" y="130" width="40" height="40" fill="#FFFFFF" />
  <rect x="280" y="140" width="20" height="20" fill="#E50914" />
  
  <!-- Bottom Left Corner -->
  <rect x="80" y="250" width="60" height="60" fill="#000000" />
  <rect x="90" y="260" width="40" height="40" fill="#FFFFFF" />
  <rect x="100" y="270" width="20" height="20" fill="#E50914" />
  
  <!-- QR Data dots -->
  <rect x="160" y="125" width="15" height="15" fill="#000000" />
  <rect x="190" y="125" width="25" height="15" fill="#000000" />
  <rect x="225" y="125" width="15" height="15" fill="#000000" />
  <rect x="150" y="150" width="20" height="20" fill="#000000" />
  <rect x="180" y="150" width="15" height="30" fill="#000000" />
  <rect x="210" y="150" width="25" height="15" fill="#000000" />
  <rect x="240" y="150" width="15" height="25" fill="#000000" />
  
  <!-- Center Logo Watermark -->
  <circle cx="200" cy="215" r="30" fill="#0A0A0A" stroke="#E50914" stroke-width="3" />
  <text x="200" y="222" fill="#E50914" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="900" text-anchor="middle">S.H.E.</text>
  
  <rect x="155" y="265" width="25" height="15" fill="#000000" />
  <rect x="190" y="260" width="15" height="25" fill="#000000" />
  <rect x="220" y="265" width="20" height="20" fill="#000000" />
  <rect x="250" y="260" width="15" height="30" fill="#000000" />
  <rect x="280" y="245" width="30" height="15" fill="#000000" />
  <rect x="270" y="280" width="20" height="20" fill="#000000" />
  
  <!-- Footer details -->
  <text x="200" y="360" fill="#F4F1EA" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" text-anchor="middle">UPI: projectshe.ngo@upi</text>
  <text x="200" y="380" fill="#737373" font-family="'Space Grotesk', sans-serif" font-size="11" text-anchor="middle">Scan with Google Pay / PhonePe / Paytm / Any BHIM UPI App</text>
</svg>
`;

async function run() {
  const destPath = path.resolve('public/assets/donation-qr.png');
  await sharp(Buffer.from(svg)).png().toFile(destPath);
  console.log('Created donation-qr.png at:', destPath);
}

run();
