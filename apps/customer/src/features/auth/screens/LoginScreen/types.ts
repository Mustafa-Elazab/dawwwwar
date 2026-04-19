import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../../../navigation/types';

export type LoginScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'LoginScreen'>;
};
