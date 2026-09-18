import type { FeatureManifest, ScreenDefinition } from './types';

export async function discoverFeatures(): Promise<FeatureManifest[]> {
  const modules = import.meta.glob<{ default: FeatureManifest }>(
    '@/features/*/feature.config.ts'
  );

  const manifests: FeatureManifest[] = [];

  for (const path in modules) {
    try {
      const mod = await modules[path]();
      if (mod.default) {
        manifests.push(mod.default);
      }
    } catch (err) {
      console.warn(`[Registry] Failed to load ${path}:`, err);
    }
  }

  return manifests;
}

export function buildScreenMap(manifests: FeatureManifest[]): Map<string, ScreenDefinition> {
  const map = new Map<string, ScreenDefinition>();
  for (const manifest of manifests) {
    if (manifest.screens) {
      for (const [name, def] of Object.entries(manifest.screens)) {
        map.set(name, def);
      }
    }
  }
  return map;
}
