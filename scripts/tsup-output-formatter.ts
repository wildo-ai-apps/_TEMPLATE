import type { Options } from 'tsup'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, join } from 'path'

// Track change counts per library-format combination
const changeCounts = new Map<string, number>()
const buildStartTimes = new Map<string, number>()

// Check for verbose mode
const isVerbose = process.env.TSUP_VERBOSE === 'true' || process.argv.includes('--verbose')

/**
 * Options for enhancing tsup configs
 */
export interface EnhanceOptions {
  /**
   * Relative paths to dependency .js.trigger files.
   * These are combined with local JS hash to create composite SHA.
   * Example: ['../saas-models/dist/esm/.build-complete.js.trigger']
   */
  dependencyJsTriggers?: string[]
}

/**
 * Get library name from package.json
 */
function getLibraryName(configPath: string): string {
  try {
    const packageJsonPath = resolve(dirname(configPath), 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    return packageJson.name || 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * Format duration in milliseconds
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Format format name (ESM/CJS)
 */
function formatFormat(format: string | string[] | undefined): string {
  if (!format) return 'UNKNOWN'
  const fmt = Array.isArray(format) ? format[0] : format
  return fmt.toUpperCase()
}

/**
 * Get unique key for tracking builds
 */
function getBuildKey(libraryName: string, format: string): string {
  return `${libraryName}:${format}`
}

// ============================================================================
// SHA-based trigger utilities (inlined for portability across workspaces)
// ============================================================================

/**
 * Recursively get all files matching extensions in a directory
 */
function getFilesRecursive(dir: string, extensions: string[]): string[] {
  const files: string[] = []
  
  if (!existsSync(dir)) return files
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...getFilesRecursive(fullPath, extensions))
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory not accessible
  }
  
  return files.sort()
}

/**
 * Compute SHA256 hash of all files with given extensions
 */
function computeFilesSha(distDir: string, extensions: string[]): string {
  const files = getFilesRecursive(distDir, extensions)
  
  const hash = createHash('sha256')
  
  for (const file of files) {
    try {
      const content = readFileSync(file)
      hash.update(file)
      hash.update(content)
    } catch {
      // Skip unreadable files
    }
  }
  
  return hash.digest('hex')
}

/**
 * Read SHA content from dependency trigger files
 */
function readDependencyTriggers(depPaths: string[]): string[] {
  return depPaths.sort().map(depPath => {
    try {
      return readFileSync(depPath, 'utf-8').trim()
    } catch {
      return '' // Dependency not built yet
    }
  })
}

/**
 * Compute composite SHA for JS trigger
 */
function computeJsTriggerSha(distDir: string, depJsTriggerPaths: string[]): string {
  const jsSha = computeFilesSha(distDir, ['.js'])
  const depShas = readDependencyTriggers(depJsTriggerPaths)
  
  const hash = createHash('sha256')
  hash.update(jsSha)
  for (const depSha of depShas) {
    hash.update(depSha)
  }
  
  return hash.digest('hex')
}

/**
 * Update the .build-complete.js.trigger file with SHA-based content.
 * Only updates if SHA has changed, preventing unnecessary cascades.
 * 
 * @returns true if trigger was updated, false if unchanged
 */
function updateJsTrigger(
  configPath: string, 
  outDir: string,
  dependencyJsTriggers: string[]
): boolean {
  try {
    const libDir = dirname(configPath)
    const distDir = resolve(libDir, outDir || 'dist/esm')
    const triggerPath = resolve(distDir, '.build-complete.js.trigger')
    
    // Resolve dependency paths relative to library
    const resolvedDepPaths = dependencyJsTriggers.map(p => resolve(libDir, p))
    
    // Compute composite SHA
    const newSha = computeJsTriggerSha(distDir, resolvedDepPaths)
    
    // Ensure directory exists
    mkdirSync(dirname(triggerPath), { recursive: true })
    
    // Read current SHA
    let currentSha = ''
    try {
      currentSha = readFileSync(triggerPath, 'utf-8').trim()
    } catch {
      // File doesn't exist yet
    }
    
    // Only write if changed
    if (currentSha !== newSha) {
      writeFileSync(triggerPath, newSha + '\n')
      return true // Updated
    }
    
    return false // Unchanged
  } catch {
    // Silently ignore errors - don't break the build
    return false
  }
}

/**
 * Enhance tsup config array with minimal output formatting and SHA-based triggers.
 * 
 * @param configPath - Path to the tsup.config.ts file (__filename)
 * @param configs - Array of tsup config objects
 * @param options - Optional enhancement options including dependency triggers
 */
export function enhanceConfigsWithMinimalOutput(
  configPath: string, 
  configs: Options[],
  options?: EnhanceOptions
): Options[] {
  const libraryName = getLibraryName(configPath)
  const dependencyJsTriggers = options?.dependencyJsTriggers || []
  
  return configs.map((config) => {
    const format = formatFormat(config.format)
    const buildKey = getBuildKey(libraryName, format)
    
    // Initialize build start time
    if (!buildStartTimes.has(buildKey)) {
      buildStartTimes.set(buildKey, Date.now())
    }

    const originalOnSuccess = config.onSuccess
    // Check if we're in watch mode from the config or process args
    const isWatchMode = config.watch || process.argv.includes('--watch')

    return {
      ...config,
      silent: !isVerbose, // Suppress default output, but errors will still be shown
      onSuccess: (options?: Options | any) => {
        const startTime = buildStartTimes.get(buildKey) || Date.now()
        const duration = Date.now() - startTime
        buildStartTimes.set(buildKey, Date.now())

        // Track changes in watch mode - check both options?.watch and config.watch
        const inWatchMode = isWatchMode || options?.watch || false

        if (inWatchMode) {
          const currentCount = changeCounts.get(buildKey) || 0
          const newCount = currentCount + 1
          changeCounts.set(buildKey, newCount)
          
          if (isVerbose) {
            // Verbose mode: show detailed output
            console.log(`\n${libraryName}: ${format} ⚡️ Build success in ${formatDuration(duration)}`)
          } else {
            // Minimal mode: show change count after first build (first build is count 1, so show from count 2)
            const changeText = newCount > 1 ? ` (change detected ${newCount - 1})` : ''
            console.log(`${libraryName}: ${format} ⚡️ Build success in ${formatDuration(duration)}${changeText}`)
          }
        } else {
          // Non-watch mode
          if (isVerbose) {
            console.log(`\n${libraryName}: ${format} ✅ Build complete in ${formatDuration(duration)}`)
          } else {
            console.log(`${libraryName}: ${format} ✅ Build complete in ${formatDuration(duration)}`)
          }
        }
        
        // Update SHA-based JS trigger file
        const triggerUpdated = updateJsTrigger(configPath, config.outDir || 'dist/esm', dependencyJsTriggers)
        if (isVerbose) {
          if (triggerUpdated) {
            console.log(`  📝 JS trigger updated (SHA changed)`)
          } else {
            console.log(`  ✓ JS trigger unchanged (SHA identical)`)
          }
        }
        
        // Call original onSuccess if provided
        if (originalOnSuccess) {
          originalOnSuccess(options)
        }
      },
    }
  })
}
