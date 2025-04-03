// clean-test.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Obtener __dirname equivalente en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para eliminar directorios recursivamente
const deleteDirectory = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`Deleted directory: ${dirPath}`);
  }
};

// Limpiar cachés que podrían estar causando problemas
const cleanCaches = () => {
  // Limpiar node_modules/.vitest
  const vitestCache = path.join(__dirname, 'node_modules', '.vitest');
  if (fs.existsSync(vitestCache)) {
    deleteDirectory(vitestCache);
  }

  // Limpiar node_modules/.vite
  const viteCache = path.join(__dirname, 'node_modules', '.vite');
  if (fs.existsSync(viteCache)) {
    deleteDirectory(viteCache);
  }

  // Limpiar carpeta de pruebas de cobertura
  const coverageDir = path.join(__dirname, 'coverage');
  if (fs.existsSync(coverageDir)) {
    deleteDirectory(coverageDir);
  }

  console.log('All test-related caches have been cleaned.');
};

// Ejecutar las pruebas de manera limpia
const runTests = () => {
  try {
    // Limpiar primero
    cleanCaches();
    
    // Ejecutar el comando de prueba
    console.log('Running tests...');
    execSync('vitest run', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error running tests:', error.message);
    process.exit(1);
  }
};

runTests();