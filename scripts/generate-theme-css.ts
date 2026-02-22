import * as fs from 'fs';
import * as path from 'path';

interface ThemeColors {
  [key: string]: string | { [key: string]: string };
}

interface ThemeConfig {
  colors: ThemeColors;
  typography: {
    fontSizes: {
      [key: string]: { size: string; lineHeight: string; letterSpacing: string };
    };
  };
  spacing: {
    [key: string]: { [key: string]: string };
  };
  radius: { [key: string]: string };
  shadows: { [key: string]: string };
  animation: {
    duration: { [key: string]: string };
    easing: { [key: string]: string };
  };
}

function generateCssVars(): void {
  const themePath = path.resolve(__dirname, '../theme.json');
  const theme: ThemeConfig = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
  const lines: string[] = [
    '/* AUTO-GENERATED — DO NOT EDIT MANUALLY */',
    '/* Run: npx tsx scripts/generate-theme-css.ts */',
    '',
    ':root {',
  ];

  // Colors
  for (const [key, value] of Object.entries(theme.colors)) {
    if (typeof value === 'string') {
      lines.push(`  --color-${key}: ${value};`);
    } else {
      for (const [shade, hex] of Object.entries(value)) {
        lines.push(`  --color-${key}-${shade}: ${hex};`);
      }
    }
  }

  lines.push('');

  // Typography
  for (const [key, val] of Object.entries(theme.typography.fontSizes)) {
    lines.push(`  --font-size-${key}: ${val.size};`);
    lines.push(`  --line-height-${key}: ${val.lineHeight};`);
    lines.push(`  --letter-spacing-${key}: ${val.letterSpacing};`);
  }

  lines.push('');

  // Spacing
  for (const [group, values] of Object.entries(theme.spacing)) {
    for (const [key, val] of Object.entries(values)) {
      lines.push(`  --spacing-${group}-${key}: ${val};`);
    }
  }

  lines.push('');

  // Radius
  for (const [key, val] of Object.entries(theme.radius)) {
    lines.push(`  --radius-${key}: ${val};`);
  }

  lines.push('');

  // Shadows
  for (const [key, val] of Object.entries(theme.shadows)) {
    lines.push(`  --shadow-${key}: ${val};`);
  }

  lines.push('');

  // Animations
  for (const [key, val] of Object.entries(theme.animation.duration)) {
    lines.push(`  --duration-${key}: ${val};`);
  }
  for (const [key, val] of Object.entries(theme.animation.easing)) {
    lines.push(`  --easing-${key}: ${val};`);
  }

  lines.push('}');
  lines.push('');

  const outputPath = path.resolve(__dirname, '../src/styles/theme-vars.generated.css');
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log('✅ Generated theme-vars.generated.css');
}

generateCssVars();
