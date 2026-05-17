import Reactotron from 'reactotron-react-native';
import { NativeModules, Platform } from 'react-native';

// In a real device, Reactotron needs to know your computer's IP address.
// We try to get it from the scriptURL (where Metro is running).
// Fallback to 10.0.2.2 for Android emulators if scriptURL fails.
let host = Platform.select({ android: '10.0.2.2', ios: 'localhost' });

if (__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  if (scriptURL) {
    host = scriptURL.split('://')[1].split(':')[0];
  }
}

// NOTE: If you are using a physical Android device over USB, 
// you MUST run: adb reverse tcp:9090 tcp:9090
// so the device can reach the Reactotron app on your computer.

Reactotron
  .configure({
    name: 'Dawwar Customer App',
    host: host,
  })
  .useReactNative({
    asyncStorage: true,
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: () => false },
    overlay: false,
  })
  .connect();

// Clear Reactotron on every fresh start
Reactotron.clear!();

// Extend console to include a tron property for easy logging if needed
if (__DEV__) {
  (console as any).tron = Reactotron;
}

console.log(`[Reactotron] Configured to host: ${host}`);

export default Reactotron;
