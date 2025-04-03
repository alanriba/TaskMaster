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
    testTimeout: 10000, // Aumentar el tiempo de espera para pruebas
    watch: false, // Limitar a un hilo para evitar problemas de memoria
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.ts']
    },

    pool: 'forks', // Usar forks en lugar de threads
    poolOptions: {
      forks: {
        isolate: false, // Evitar aislamiento para reducir el número de archivos abiertos
      },
    },
    deps: {
      optimizer: {
        web: {
          exclude: ['@mui/material', '@mui/icons-material'] // Excluir MUI del optimizador
        }
      }
    }
  },
});