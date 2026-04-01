/**
 * react-native.config.js
 *
 * Provides project metadata for the RN Gradle autolinking plugin, and
 * excludes native modules that are installed but not yet used.
 *
 * Remove a module from the dependencies block when you start using it.
 */
module.exports = {
  project: {
    android: {
      packageName: 'com.dawwarcustomer',
      sourceDir: './android',
    },
  },
  dependencies: {
    // Phase 2 — voice recording for Custom Order Screen (Task 16)
    '@react-native-voice/voice': { platforms: { android: null, ios: null } },

    // Phase 2 — map views for Tracking Screen
    'react-native-maps': { platforms: { android: null, ios: null } },

    // Phase 2 — Firebase push notifications
    '@react-native-firebase/app': { platforms: { android: null, ios: null } },
    '@react-native-firebase/messaging': { platforms: { android: null, ios: null } },

    // Phase 2 — optimised image loading
    'react-native-fast-image': { platforms: { android: null, ios: null } },

    // Reanimated v3 - exclude until actively used
    'react-native-reanimated': { platforms: { android: null, ios: null } },
  },
};
