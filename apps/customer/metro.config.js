const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// The app's own folder
const projectRoot = __dirname;
// The monorepo root (two levels up from apps/customer)
const monorepoRoot = path.resolve(projectRoot, '../..');

/**
 * Metro Configuration for pnpm monorepo
 *
 * WHY watchFolders: Metro only watches the project root by default.
 * Packages in the monorepo (packages/ui, packages/theme, etc.) live
 * outside the app folder. Without watchFolders, Metro never sees their
 * changes and cannot resolve their imports.
 *
 * WHY nodeModulesPaths: pnpm with node-linker=hoisted puts packages in
 * the root node_modules, not app-level. We must tell Metro where to look.
 */
const config = {
  watchFolders: [monorepoRoot],

  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    // Prevents Metro from bundling multiple copies of React
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react' || moduleName === 'react-native') {
        return {
          filePath: require.resolve(moduleName, {
            paths: [path.resolve(monorepoRoot, 'node_modules')],
          }),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
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
