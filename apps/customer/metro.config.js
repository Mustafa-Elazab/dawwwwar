const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/**
 * Modules that MUST resolve to a single physical instance.
 * Each value is resolved to its realpath so we compare consistently.
 */
const SINGLETON_PINS = {
  'react': path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-safe-area-context': path.resolve(projectRoot, 'node_modules/react-native-safe-area-context'),
  'react-native-screens': path.resolve(projectRoot, 'node_modules/react-native-screens'),
  'react-native-gesture-handler': path.resolve(projectRoot, 'node_modules/react-native-gesture-handler'),
  'react-native-reanimated': path.resolve(projectRoot, 'node_modules/react-native-reanimated'),
  '@react-navigation/elements': path.resolve(projectRoot, 'node_modules/@react-navigation/elements'),
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
