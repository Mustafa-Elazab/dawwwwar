const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/**
 * Resolve a package directory, preferring the app's node_modules
 * and falling back to the monorepo root (required for pnpm workspaces
 * where dependencies may only exist at the root level).
 */
const resolvePackage = (pkg) => {
  const appPath = path.resolve(projectRoot, 'node_modules', pkg);
  if (fs.existsSync(appPath)) return appPath;
  return path.resolve(monorepoRoot, 'node_modules', pkg);
};

/**
 * Modules that MUST resolve to a single physical instance.
 * Each value is resolved to its realpath so we compare consistently.
 */
const SINGLETON_PINS = {
  'react': resolvePackage('react'),
  'react-native': resolvePackage('react-native'),
  'react-native-safe-area-context': resolvePackage('react-native-safe-area-context'),
  'react-native-screens': resolvePackage('react-native-screens'),
  'react-native-gesture-handler': resolvePackage('react-native-gesture-handler'),
  'react-native-reanimated': resolvePackage('react-native-reanimated'),
  '@react-navigation/elements': resolvePackage('@react-navigation/elements'),
};

const config = {
  watchFolders: [monorepoRoot],

  resolver: {
    /**
     * Priority order: app-level node_modules first, then monorepo root.
     */
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],

    /**
     * Singleton guard — intercepts bare package specifiers and routes them
     * to the app-local node_modules. Only fires for bare names (not absolute
     * paths) to avoid infinite recursion.
     */
    resolveRequest: (context, moduleName, platform) => {
      // Only intercept bare specifiers (not absolute/relative paths)
      if (!moduleName.startsWith('/') && !moduleName.startsWith('.')) {
        for (const [pkg, pinnedPath] of Object.entries(SINGLETON_PINS)) {
          if (moduleName === pkg || moduleName.startsWith(pkg + '/')) {
            const suffix = moduleName.slice(pkg.length); // '' or '/sub/path'
            const absolutePath = pinnedPath + suffix;
            return context.resolveRequest(context, absolutePath, platform);
          }
        }
      }
      return context.resolveRequest(context, moduleName, platform);
    },

    /**
     * extraNodeModules acts as a last-resort fallback (after resolveRequest).
     * Keep it in sync with SINGLETON_PINS for belt-and-suspenders safety.
     */
    extraNodeModules: SINGLETON_PINS,
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
