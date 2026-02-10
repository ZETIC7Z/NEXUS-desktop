const fs = require('fs');
const path = require('path');

const webPackagePath = path.resolve('../p=stream sam 12-20-25/package.json');
const desktopPackagePath = path.resolve('./package.json');

const webPackage = JSON.parse(fs.readFileSync(webPackagePath, 'utf8'));
const desktopPackage = JSON.parse(fs.readFileSync(desktopPackagePath, 'utf8'));

// Merge Dependencies
const dependencies = { ...webPackage.dependencies, ...desktopPackage.dependencies };
const devDependencies = { ...webPackage.devDependencies, ...desktopPackage.devDependencies };

// Add concurrently if missing (we'll need it for dev)
if (!devDependencies.concurrently) {
    devDependencies.concurrently = "^8.0.0";
}

// Merge Scripts
const scripts = { ...desktopPackage.scripts };
scripts['web:dev'] = webPackage.scripts.dev;
scripts['web:build'] = webPackage.scripts.build;
scripts['electron:start'] = desktopPackage.scripts.start;

// Main dev script: run vite and electron concurrently
// Wait for vite to be ready? Electron usually loads index.html fallback or needs localhost.
// Simple approach: run both.
scripts['dev'] = 'concurrently -k "npm run web:dev" "npm run electron:start"';
scripts['build'] = 'npm run web:build && electron-builder'; // Override build to do web build first

// Update Desktop Package
desktopPackage.dependencies = dependencies;
desktopPackage.devDependencies = devDependencies;
desktopPackage.scripts = scripts;

// Remove type: module if present in desktop to avoid cjs/esm conflict with main.js? 
// Desktop main.js is require(). Web might be module. 
// Copied vite.config.mts suggests ESM. 
// Let's keep it as is, Electron supports both if configured. 
// But main.js uses require(), so we should probably NOT set type: module at root unless we convert main.js.

fs.writeFileSync(desktopPackagePath, JSON.stringify(desktopPackage, null, 2));

console.log('package.json merged successfully!');
