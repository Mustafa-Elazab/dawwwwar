import Reactotron, { networking } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import { Platform } from 'react-native';

// Only run in development — NEVER in production
if (__DEV__) {
  Reactotron
    .configure({
      name: 'Dawwar Merchant',
      // Android emulator: use 10.0.2.2 instead of localhost
      host: Platform.OS === 'android' ? '10.0.2.2' : 'localhost',
    })
    .useReactNative({
      asyncStorage: false, // we use MMKV, not AsyncStorage
      networking: {
        // ignore these noisy endpoints
        ignoreUrls: /\/logs$|\/sockjs-node|hot-update/,
      },
      editor: false,
      errors: { veto: () => false },
      overlay: false,
    })
    .use(reactotronRedux())
    .use(networking() as any)
    .connect();

  // Clear timeline on every reload
  Reactotron.clear?.();

  // Override console so logs appear in Reactotron timeline
  // @ts-ignore
  console.tron = Reactotron;
}

export default Reactotron;
