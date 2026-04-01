import { useEffect } from 'react';
import Reactotron from 'reactotron-react-native';

let initialized = false;

export function useReactotron() {
  useEffect(() => {
    if (__DEV__ && !initialized) {
      Reactotron.configure({
        name: 'Dawwar Customer App',
      })
        .useReactNative()
        .connect();

      initialized = true;
      console.log('Reactotron initialized');
    }
  }, []);
}
