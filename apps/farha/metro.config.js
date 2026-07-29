const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const resolvePackage = (pkg) => {
  const appPath = path.resolve(projectRoot, 'node_modules', pkg);
  if (fs.existsSync(appPath)) return appPath;
  return path.resolve(monorepoRoot, 'node_modules', pkg);
};

const SINGLETON_PINS = {
  react: resolvePackage('react'),
  'react-native': resolvePackage('react-native'),
  'react-native-gesture-handler': resolvePackage('react-native-gesture-handler'),
  'react-native-reanimated': resolvePackage('react-native-reanimated'),
  'react-native-safe-area-context': resolvePackage('react-native-safe-area-context'),
  'react-native-screens': resolvePackage('react-native-screens'),
};

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    resolveRequest: (context, moduleName, platform) => {
      if (!moduleName.startsWith('/') && !moduleName.startsWith('.')) {
        for (const [pkg, pinnedPath] of Object.entries(SINGLETON_PINS)) {
          if (moduleName === pkg || moduleName.startsWith(`${pkg}/`)) {
            const suffix = moduleName.slice(pkg.length);
            return context.resolveRequest(context, `${pinnedPath}${suffix}`, platform);
          }
        }
      }

      return context.resolveRequest(context, moduleName, platform);
    },
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
