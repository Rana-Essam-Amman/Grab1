import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const featureName = process.argv[2];

if (!featureName) {
  console.error('Error: Please provide a feature name in kebab-case.');
  console.log('Example: node scripts/new-feature.mjs notifications');
  process.exit(1);
}

// 1. Validate feature name (kebab-case, no spaces)
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(featureName)) {
  console.error('Error: Feature name must be in kebab-case (e.g., "my-feature").');
  process.exit(1);
}

const targetDir = path.join(process.cwd(), 'src', 'features', featureName);

// 2. Check if folder already exists
if (fs.existsSync(targetDir)) {
  console.error(`Error: Feature folder "src/features/${featureName}" already exists.`);
  process.exit(1);
}

const pascalName = featureName
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

const folders = [
  'screens',
  'components',
  'hooks',
  'store',
  'locales',
];

try {
  // 3. Create folder structure
  fs.mkdirSync(targetDir, { recursive: true });
  folders.forEach((f) => fs.mkdirSync(path.join(targetDir, f), { recursive: true }));

  // 4. Create feature.config.ts
  const configContent = `import { defineFeature } from '@/shared/registry';

export default defineFeature({
  name: '${featureName}',
  screens: {
    '${featureName}': {
      name: '${featureName}',
      component: () => import('./screens/${pascalName}Screen').then((m) => ({ default: m.${pascalName}Screen })),
      guard: 'public',
    },
  },
  locales: {
    ar: () => import('./locales/ar.json').then((m) => ({ default: m.default })),
    en: () => import('./locales/en.json').then((m) => ({ default: m.default })),
  },
});
`;

  // 5. Create screen template
  const screenContent = `import React from 'react';
import { useUI } from '@/hooks/useUI';
import { useTranslation } from '@/shared/i18n';

export const ${pascalName}Screen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 bg-surface sticky top-0 z-20">
        <button onClick={goBack} className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-ink-muted hover:bg-border transition-colors cursor-pointer">
          {isArabic ? '→' : '←'}
        </button>
        <h1 className="text-base font-bold text-ink">
          {t('${featureName}.title')}
        </h1>
      </div>
      <div className="p-4">
        <p className="text-ink-muted text-sm">
          {isArabic ? 'هذه الشاشة فارغة. ابدأ البناء!' : 'This screen is empty. Start building!'}
        </p>
      </div>
    </div>
  );
};
`;

  // 6. Create ar.json
  const arLocales = JSON.stringify({ title: 'عنوان جديد' }, null, 2);

  // 7. Create en.json
  const enLocales = JSON.stringify({ title: 'New Feature' }, null, 2);

  // 8. Create index.ts
  const indexContent = `// Feature: ${featureName}
export * from './screens/${pascalName}Screen';
`;

  fs.writeFileSync(path.join(targetDir, 'feature.config.ts'), configContent);
  fs.writeFileSync(path.join(targetDir, 'screens', `${pascalName}Screen.tsx`), screenContent);
  fs.writeFileSync(path.join(targetDir, 'locales', 'ar.json'), arLocales);
  fs.writeFileSync(path.join(targetDir, 'locales', 'en.json'), enLocales);
  fs.writeFileSync(path.join(targetDir, 'index.ts'), indexContent);

  console.log(`\n✅ Feature "${featureName}" scaffolded successfully at src/features/${featureName}`);
  console.log('\nNext steps:');
  console.log(`1. Review templates/ in root for compliant skeletons (screen.md, hook.md, component.md).`);
  console.log(`2. Read docs/REFERENCE_IMPLEMENTATIONS.md before writing code.`);
  console.log(`3. Run "npm run audit:arch" to verify compliance against Rule 14.`);
  console.log('\nHappy coding! 🚀');

} catch (error) {
  console.error('Error creating feature:', error);
  process.exit(1);
}
