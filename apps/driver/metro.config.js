const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = {
  watchFolders: [monorepoRoot],

  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    // Critical: prevent Metro from picking up the wrong react/react-native
    extraNodeModules: {
      'react': path.resolve(monorepoRoot, 'node_modules/react'),
      'react-native': path.resolve(monorepoRoot, 'node_modules/react-native'),
      'react-native-safe-area-context': path.resolve(projectRoot, 'node_modules/react-native-safe-area-context'),
      'react-native-screens': path.resolve(projectRoot, 'node_modules/react-native-screens'),
      'react-native-gesture-handler': path.resolve(projectRoot, 'node_modules/react-native-gesture-handler'),
      '@react-navigation/elements': path.resolve(projectRoot, 'node_modules/@react-navigation/elements'),
      'react-native-reanimated': path.resolve(projectRoot, 'node_modules/react-native-reanimated'),
      '@gorhom/bottom-sheet': path.resolve(projectRoot, 'node_modules/@gorhom/bottom-sheet'),
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
