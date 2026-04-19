import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../../../navigation/types';
import { AUTH_ROUTES } from '../../../../navigation/routes';

export const useController = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const handleLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  const handleSignup = () => {
    navigation.navigate(AUTH_ROUTES.REGISTER);
  };

  return {
    handleLogin,
    handleSignup,
  };
};
