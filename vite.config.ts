/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  define: {
    __BUILD_HASH__: JSON.stringify(
      (process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || 'dev').slice(0, 7)
    ),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 16)),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/schemas': path.resolve(__dirname, './src/schemas'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/api': path.resolve(__dirname, './src/api'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-state': ['zustand', 'immer'],
          'vendor-icons': ['iconsax-react'],
          'vendor-motion': ['motion'],
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
          ],
          'vendor-forms': ['zod', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-supabase': ['@supabase/supabase-js', '@noble/hashes'],
          'vendor-sentry': ['@sentry/react'],
          'vendor-ui': ['@iconify/react', 'vaul', 'sonner'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    },
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
      exclude: [
        'node_modules/**',
        'src/test/**',
        'src/app/**',
        'src/features/**',
        'src/shared/registry/**',
        'src/shared/ui/**',
        'src/shared/components/**',
        '**/imageUtils.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    },
  },
});
