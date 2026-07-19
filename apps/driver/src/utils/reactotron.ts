import { NativeModules, Platform } from 'react-native';
import Reactotron from 'reactotron-react-native';

const getReactotronHost = () => {
  const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const scriptURL = NativeModules.SourceCode?.scriptURL;

  if (!scriptURL) {
    return fallbackHost;
  }

  return scriptURL.split('://')[1]?.split(':')[0] || fallbackHost;
};

if (__DEV__) {
  const host = getReactotronHost();

  Reactotron.configure({
    name: 'Dawwar Driver App',
    host,
  })
    .useReactNative({
      asyncStorage: false,
      networking: {
        ignoreUrls: /symbolicate/,
      },
      editor: false,
      errors: { veto: () => false },
      overlay: false,
    })
    .connect();

  Reactotron.clear?.();
  (console as any).tron = Reactotron;

  console.log(`[Reactotron] Driver configured to host: ${host}`);
}

export default Reactotron;
