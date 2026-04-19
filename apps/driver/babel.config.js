module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          // Removed '@': './src' to avoid overriding scoped npm packages like @react-navigation
        },
      },
    ],
    // React Native Reanimated plugin must be last
    'react-native-reanimated/plugin',
  ],
};
