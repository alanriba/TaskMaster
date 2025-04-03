// vitest.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    include: ['src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    cache: false, 
    testTimeout: 10000, 
    watch: false,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts']
    },

    pool: 'forks', 
    poolOptions: {
      forks: {
        isolate: false,
      },
    },
    deps: {
      optimizer: {
        web: {
          exclude: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  },
});