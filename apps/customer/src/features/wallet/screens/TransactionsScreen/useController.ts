import { useTranslation } from '@dawwar/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTransactions } from '../../core/hooks';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { data: transactions, isLoading, isError, refetch } = useTransactions();

  return {
    transactions: transactions ?? [],
    isLoading,
    isError,
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}
