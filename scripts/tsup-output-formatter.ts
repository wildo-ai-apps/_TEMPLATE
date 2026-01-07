import type { Options } from 'tsup'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'

// Track change counts per library-format combination
const changeCounts = new Map<string, number>()
const buildStartTimes = new Map<string, number>()

// Check for verbose mode
const isVerbose = process.env.TSUP_VERBOSE === 'true' || process.argv.includes('--verbose')

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

/**
 * Enhance tsup config array with minimal output formatting
 */
export function enhanceConfigsWithMinimalOutput(configPath: string, configs: Options[]): Options[] {
  const libraryName = getLibraryName(configPath)
  
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
        
        // Call original onSuccess if provided
        if (originalOnSuccess) {
          originalOnSuccess(options)
        }
      },
    }
  })
}

