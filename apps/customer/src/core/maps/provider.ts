import { Platform } from 'react-native';
import { PROVIDER_GOOGLE, type Provider } from 'react-native-maps';

export const mapProvider: Provider | undefined =
  Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;
