import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputDir = path.resolve(process.cwd(), 'public/survey-photos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createSmileSvg(title: string, subtitle: string, variationIndex: number): string {
  // Variations to produce distinct visual smiles
  const curvature = 20 + (variationIndex % 7) * 8; // smile arc curvature
  const width = 280 + (variationIndex % 5) * 15; // smile width
  const toothHeight = 45 + (variationIndex % 4) * 6;
  const hue = 210 + (variationIndex * 13) % 40; // subtle medical slate-blue hues

  return `
  <svg width="800" height="520" viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue}, 25%, 96%)" />
        <stop offset="100%" stop-color="hsl(${hue}, 20%, 90%)" />
      </linearGradient>
      <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#d9777f" />
        <stop offset="100%" stop-color="#b8535c" />
      </linearGradient>
      <linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="85%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12" />
      </filter>
    </defs>

    <!-- Background card -->
    <rect width="800" height="520" fill="url(#bgGrad)" />

    <!-- Scientific grid background subtle -->
    <g opacity="0.15" stroke="#64748b" stroke-width="1" stroke-dasharray="4,4">
      <line x1="100" y1="260" x2="700" y2="260" />
      <line x1="400" y1="100" x2="400" y2="420" />
      <circle cx="400" cy="260" r="160" fill="none" />
    </g>

    <!-- Header info banner -->
    <rect x="40" y="30" width="720" height="50" rx="8" fill="#ffffff" filter="url(#shadow)" opacity="0.9" />
    <text x="60" y="62" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#1e293b">
      ${title}
    </text>
    <text x="740" y="62" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#64748b">
      ${subtitle}
    </text>

    <!-- Smile Illustration Frame -->
    <g transform="translate(400, 260)">
      <!-- Oral cavity background (dark inside mouth) -->
      <path d="M -${width/2 + 20} 0 Q 0 ${curvature + 50} ${width/2 + 20} 0 Q 0 -25 -${width/2 + 20} 0 Z" fill="#2d0d12" />

      <!-- Upper Teeth Arc -->
      <!-- Central Incisors -->
      <path d="M -18 -15 L -2 -15 L -3 ${toothHeight} Q -10 ${toothHeight + 4} -17 ${toothHeight} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />
      <path d="M 2 -15 L 18 -15 L 17 ${toothHeight} Q 10 ${toothHeight + 4} 3 ${toothHeight} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />

      <!-- Lateral Incisors -->
      <path d="M -34 -12 L -19 -14 L -18 ${toothHeight - 4} Q -26 ${toothHeight - 2} -33 ${toothHeight - 6} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />
      <path d="M 19 -14 L 34 -12 L 33 ${toothHeight - 6} Q 26 ${toothHeight - 2} 18 ${toothHeight - 4} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />

      <!-- Canines -->
      <path d="M -48 -9 L -35 -12 L -34 ${toothHeight - 6} Q -41 ${toothHeight - 4} -47 ${toothHeight - 12} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />
      <path d="M 35 -12 L 48 -9 L 47 ${toothHeight - 12} Q 41 ${toothHeight - 4} 34 ${toothHeight - 6} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />

      <!-- Premolars -->
      <path d="M -62 -6 L -49 -9 L -48 ${toothHeight - 12} Q -55 ${toothHeight - 15} -61 ${toothHeight - 20} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />
      <path d="M 49 -9 L 62 -6 L 61 ${toothHeight - 20} Q 55 ${toothHeight - 15} 48 ${toothHeight - 12} Z" fill="url(#toothGrad)" stroke="#cbd5e1" stroke-width="1" />

      <!-- Upper Lip contour -->
      <path d="M -${width/2 + 25} -5 Q -${width/4} -30 0 -22 Q ${width/4} -30 ${width/2 + 25} -5 Q ${width/4} -12 0 -15 Q -${width/4} -12 -${width/2 + 25} -5 Z" fill="url(#lipGrad)" filter="url(#shadow)" />

      <!-- Lower Lip contour -->
      <path d="M -${width/2 + 25} -5 Q 0 ${curvature + 55} ${width/2 + 25} -5 Q 0 ${curvature + 35} -${width/2 + 25} -5 Z" fill="url(#lipGrad)" filter="url(#shadow)" />

      <!-- Aesthetic Measurement Arc Guide (aesthetic curve) -->
      <path d="M -${width/2} 0 Q 0 ${curvature + 42} ${width/2} 0" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="5,3" opacity="0.6" />
    </g>

    <!-- Footer label -->
    <text x="400" y="475" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#475569" letter-spacing="1">
      DR. NEHMEDO FRONTAL SMILE ASSESSMENT STUDY • STANDARDIZED CLINICAL VIEW
    </text>
  </svg>
  `;
}

async function generateAll() {
  console.log('Generating standardized photo assets into /public/survey-photos/...');

  // 1. Rating photos: smile_01 to smile_21
  for (let i = 1; i <= 21; i++) {
    const id = `smile_${String(i).padStart(2, '0')}`;
    const filename = `${id}.jpg`;
    const svg = createSmileSvg(`Standardized Smile Assessment #${i}`, `ID: ${id}`, i);
    const dest = path.join(outputDir, filename);

    await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(dest);
    console.log(`Generated: ${filename}`);
  }

  // 2. Ranking photos: setA_1..4 to setF_1..4
  const sets = ['A', 'B', 'C', 'D', 'E', 'F'];
  let counter = 22;
  for (const s of sets) {
    for (let p = 1; p <= 4; p++) {
      const id = `set${s}_${p}`;
      const filename = `${id}.jpg`;
      const svg = createSmileSvg(`Set ${s} — Photo #${p}`, `ID: ${id}`, counter++);
      const dest = path.join(outputDir, filename);

      await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(dest);
      console.log(`Generated: ${filename}`);
    }
  }

  console.log('\nAll 45 photos successfully generated in /public/survey-photos/!');
}

generateAll().catch(console.error);
