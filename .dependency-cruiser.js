export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies cause runtime crashes (e.g., useListingsStore before initialization).',
      from: {},
      to: { circular: true }
    },
    {
      name: 'no-cross-store-imports',
      severity: 'error',
      comment: 'Slices must NOT import other slices directly. Use the Registration Pattern.',
      from: { path: '^src/(store|features/[^/]+/store)' },
      to: { path: '^src/(store|features/[^/]+/store)', pathNot: ['$1'] }
    },
    {
      name: 'no-feature-to-feature',
      severity: 'warn',
      comment: 'Features should not import each other directly. Extract shared logic to shared/ or use the Registry.',
      from: { path: '^src/features/([^/]+)/' },
      to: { path: '^src/features/([^/]+)/', pathNot: ['^src/features/$1/'] }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Files that nothing imports and that import nothing (dead code).',
      from: {
        orphan: true,
        pathNot: [
          '\\.(test|spec)\\.tsx?$',
          '^src/test/',
          '^src/main\\.tsx$',
          '^src/vite-env\\.d\\.ts$',
          '^templates/',
          '^scripts/',
          '^docs/',
          '^eslint\\.config\\.js',
          '^\\.dependency-cruiser\\.js',
          '.*\\.types\\.ts$',
          '^src/types\\.ts$',
          '^src/data/locations/types\\.ts$',
          '^src/data/seedListings/types\\.ts$',
          '^src/features/[^/]+/store/[^/]+\\.slice\\.types\\.ts$',
          '^src/store/[^/]+\\.slice\\.types\\.ts$',
          '^src/data/catalog\\.ts$',
          '^src/app/index\\.ts$',
          '^src/api/queryKeys\\.ts$',
          '^src/shared/lib/marketAssertions\\.ts$'
        ]
      },
      to: {}
    }
  ],
  options: {
    tsPreCompilationDeps: true,
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default']
    },
    reporterOptions: {
      text: { highlightFocused: true }
    }
  }
};
