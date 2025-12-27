#!/usr/bin/env node
/**
 * OXC-based Declaration File Generator for apps-custom libs
 * 
 * Uses oxc-transform's isolatedDeclaration() to generate .d.ts files
 * without the memory overhead of tsc. Requires code to have explicit
 * type annotations on all exports (isolatedDeclarations compliance).
 * 
 * Usage:
 *   node scripts/generate-dts.mjs <lib-name>          # One-time build
 *   node scripts/generate-dts.mjs <lib-name> --watch  # Watch mode
 * 
 * Example:
 *   node scripts/generate-dts.mjs custom-frontend-main-lib
 *   node scripts/generate-dts.mjs custom-backend-lib --watch
 */

import { isolatedDeclaration } from 'oxc-transform';
import { readdir, readFile, writeFile, mkdir, unlink } from 'fs/promises';
import { join, relative, dirname, resolve } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(__dirname, '..');

// Parse arguments
const args = process.argv.slice(2);
const LIB_NAME = args.find(a => !a.startsWith('--'));
const WATCH_MODE = args.includes('--watch');
const VERBOSE = process.env.OXC_VERBOSE === 'true' || args.includes('--verbose');

if (!LIB_NAME) {
  console.error('Usage: node scripts/generate-dts.mjs <lib-name> [--watch]');
  console.error('Example: node scripts/generate-dts.mjs custom-frontend-main-lib');
  process.exit(1);
}

const LIB_DIR = resolve(APP_ROOT, LIB_NAME);
const SRC_DIR = join(LIB_DIR, 'src');
const OUT_DIR = join(LIB_DIR, 'dist/esm');

// Validate lib exists
if (!existsSync(LIB_DIR)) {
  console.error(`Library not found: ${LIB_DIR}`);
  process.exit(1);
}

// Get library name from package.json
function getLibraryName() {
  try {
    const packageJsonPath = join(LIB_DIR, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.name || LIB_NAME;
  } catch {
    return LIB_NAME;
  }
}

const LIBRARY_NAME = getLibraryName();

/**
 * Recursively get all .ts/.tsx files (excluding .d.ts and test files)
 */
async function getTypeScriptFiles(dir) {
  const files = [];
  
  if (!existsSync(dir)) {
    return files;
  }
  
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...await getTypeScriptFiles(fullPath));
    } else if (
      entry.isFile() && 
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) && 
      !entry.name.endsWith('.d.ts') &&
      !entry.name.includes('.test.') &&
      !entry.name.includes('.spec.')
    ) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Generate .d.ts for a single file using oxc-transform
 */
async function generateDeclaration(filePath) {
  const sourceText = await readFile(filePath, 'utf-8');
  
  // Skip empty files
  if (!sourceText.trim()) {
    return { filePath, success: true, code: null, skipped: true };
  }
  
  const result = await isolatedDeclaration(filePath, sourceText);
  
  // OXC generates code even with errors (warnings), so check for code first
  if (result.code) {
    return { filePath, success: true, code: result.code };
  }
  
  return { filePath, success: false, errors: result.errors };
}

/**
 * Write declaration file to output directory
 */
async function writeDeclaration(srcPath, dtsContent) {
  const relativePath = relative(SRC_DIR, srcPath);
  const outPath = join(OUT_DIR, relativePath.replace(/\.tsx?$/, '.d.ts'));
  const outDir = dirname(outPath);
  
  if (!existsSync(outDir)) {
    await mkdir(outDir, { recursive: true });
  }
  
  await writeFile(outPath, dtsContent);
  return outPath;
}

/**
 * Process a single file and report result
 */
async function processFile(filePath, silent = false) {
  try {
    const result = await generateDeclaration(filePath);
    
    if (result.success && result.code) {
      await writeDeclaration(result.filePath, result.code);
      if (!silent) {
        console.log(`  ✓ ${relative(SRC_DIR, filePath)}`);
      }
      return true;
    } else if (result.errors) {
      console.log(`  ✗ ${relative(SRC_DIR, filePath)}`);
      for (const err of result.errors.slice(0, 2)) {
        console.log(`    └─ ${(err.message || err).substring(0, 80)}`);
      }
      return false;
    }
    return true; // No code but no errors (empty file)
  } catch (err) {
    console.log(`  ✗ ${relative(SRC_DIR, filePath)} - ${err.message}`);
    return false;
  }
}

async function buildAll() {
  const startTime = performance.now();
  
  if (VERBOSE) {
    console.log(`🔷 OXC Declaration Generator (${LIBRARY_NAME})`);
    console.log('━'.repeat(50));
  }
  
  const files = await getTypeScriptFiles(SRC_DIR);
  
  if (VERBOSE) {
    console.log(`📁 Found ${files.length} TypeScript files`);
  }
  
  const BATCH_SIZE = 20;
  const results = { success: 0, failed: 0, skipped: 0 };
  
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(f => generateDeclaration(f)));
    
    for (const result of batchResults) {
      if (result.skipped) {
        results.skipped++;
      } else if (result.success && result.code) {
        await writeDeclaration(result.filePath, result.code);
        results.success++;
      } else if (result.errors) {
        results.failed++;
        // Always show errors
        console.log(`\n  ✗ ${relative(SRC_DIR, result.filePath)}`);
        for (const err of result.errors.slice(0, 3)) {
          console.log(`    └─ ${(err.message || String(err)).substring(0, 100)}`);
        }
      } else {
        results.success++; // No code, no errors
      }
    }
    
    if (VERBOSE) {
      const progress = Math.min(i + BATCH_SIZE, files.length);
      process.stdout.write(`\r⚡ Processing: ${progress}/${files.length}`);
    }
  }
  
  if (VERBOSE) {
    console.log();
  }
  
  const duration = ((performance.now() - startTime) / 1000).toFixed(2);
  const durationMs = Math.round((performance.now() - startTime));
  const durationText = durationMs < 1000 ? `${durationMs}ms` : `${duration}s`;
  
  if (VERBOSE) {
    console.log('━'.repeat(50));
    console.log(`✅ Generated: ${results.success} declaration files`);
    if (results.skipped > 0) {
      console.log(`⏭️  Skipped: ${results.skipped} empty files`);
    }
    if (results.failed > 0) {
      console.log(`❌ Failed: ${results.failed} files`);
    }
    console.log(`⏱️  Completed in ${durationText}`);
  } else {
    // Minimal output
    if (results.failed > 0) {
      console.log(`${LIBRARY_NAME}: DTS ❌ Failed: ${results.failed} files`);
    } else {
      console.log(`${LIBRARY_NAME}: DTS ✅ Build complete in ${durationText}`);
    }
  }
  
  return results.failed === 0;
}

async function watchMode() {
  if (VERBOSE) {
    console.log(`🔷 OXC Declaration Generator - Watch Mode (${LIBRARY_NAME})`);
    console.log('━'.repeat(50));
  }
  
  // Initial build
  await buildAll();
  
  if (VERBOSE) {
    console.log('\n👀 Watching for changes...\n');
  }
  
  const watcher = chokidar.watch([`${SRC_DIR}/**/*.ts`, `${SRC_DIR}/**/*.tsx`], {
    ignored: [
      /(^|[\/\\])\../,
      /\.d\.ts$/,
      /\.test\.(ts|tsx)$/,
      /\.spec\.(ts|tsx)$/
    ],
    persistent: true,
    ignoreInitial: true
  });
  
  let changeCount = 0;
  
  watcher.on('add', async (filePath) => {
    changeCount++;
    if (VERBOSE) {
      console.log(`  ➕ ${relative(SRC_DIR, filePath)}`);
    }
    const startTime = performance.now();
    const success = await processFile(filePath, !VERBOSE);
    const duration = Math.round(performance.now() - startTime);
    if (!VERBOSE && success) {
      const changeText = changeCount > 1 ? ` (change #${changeCount})` : '';
      console.log(`${LIBRARY_NAME}: DTS ⚡️ Build success in ${duration}ms${changeText}`);
    }
  });
  
  watcher.on('change', async (filePath) => {
    changeCount++;
    if (VERBOSE) {
      console.log(`  ⚡ ${relative(SRC_DIR, filePath)}`);
    }
    const startTime = performance.now();
    const success = await processFile(filePath, !VERBOSE);
    const duration = Math.round(performance.now() - startTime);
    if (!VERBOSE && success) {
      const changeText = changeCount > 1 ? ` (change #${changeCount})` : '';
      console.log(`${LIBRARY_NAME}: DTS ⚡️ Build success in ${duration}ms${changeText}`);
    }
  });
  
  watcher.on('unlink', async (filePath) => {
    const relativePath = relative(SRC_DIR, filePath);
    const dtsPath = join(OUT_DIR, relativePath.replace(/\.tsx?$/, '.d.ts'));
    if (existsSync(dtsPath)) {
      await unlink(dtsPath);
      if (VERBOSE) {
        console.log(`  🗑️  ${relativePath} (removed)`);
      }
    }
  });
  
  process.on('SIGINT', () => {
    watcher.close();
    if (VERBOSE) {
      console.log('\n👋 Stopped watching');
    }
    process.exit(0);
  });
}

// Main
if (WATCH_MODE) {
  watchMode().catch(console.error);
} else {
  buildAll().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

