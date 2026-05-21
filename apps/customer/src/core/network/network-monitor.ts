import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean;
};

let lastState: NetworkStatus = {
  isConnected: true,
  isInternetReachable: true,
};

export const getNetworkStatus = () => lastState;

export const subscribeNetworkStatus = (listener: (state: NetworkStatus) => void) => {
  return NetInfo.addEventListener((state: NetInfoState) => {
    lastState = {
      isConnected: !!state.isConnected,
      isInternetReachable: state.isInternetReachable !== false,
    };
    listener(lastState);
  });
};
