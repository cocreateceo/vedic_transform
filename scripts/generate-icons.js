const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '..', 'public', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated icon-${size}.png`);
  }

  // Also generate apple-touch-icon (180x180)
  const applePath = path.join(outputDir, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(applePath);
  console.log('Generated apple-touch-icon.png');

  // Copy apple-touch-icon to public root for Safari
  const appleRootPath = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
  fs.copyFileSync(applePath, appleRootPath);
  console.log('Copied apple-touch-icon.png to public root');

  // Generate favicon
  const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath.replace('.ico', '.png'));
  console.log('Generated favicon.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
