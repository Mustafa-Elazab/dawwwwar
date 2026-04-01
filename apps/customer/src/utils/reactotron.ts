import Reactotron from 'reactotron-react-native';

Reactotron.configure({
  name: 'Dawwar Customer App',
})
  .useReactNative()
  .connect();

export default Reactotron;
