import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useMerchantProducts, useToggleAvailability, useDeleteProduct } from '../../core/hooks';
import { MERCHANT_ROUTES } from '../../../navigation/routes';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState<string | undefined>();

  const { data: products, isLoading, isError, refetch } = useMerchantProducts();
  const toggleMutation = useToggleAvailability();
  const deleteMutation = useDeleteProduct();

  const filtered = (products ?? []).filter(
    (p) =>
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameAr.includes(search),
  );

  const handleToggle = useCallback(
    async (productId: string, isAvailable: boolean) => {
      setTogglingId(productId);
      await toggleMutation.mutateAsync({ productId, isAvailable });
      setTogglingId(undefined);
    },
    [toggleMutation],
  );

  const handleDelete = useCallback(
    (productId: string) => deleteMutation.mutate(productId),
    [deleteMutation],
  );

  return {
    search, setSearch,
    products: filtered,
    isLoading, isError,
    togglingId,
    handleToggle,
    handleDelete,
    handleAddNew: () => navigation.navigate(MERCHANT_ROUTES.ADD_EDIT_PRODUCT, {}),
    handleEdit: (productId: string) =>
      navigation.navigate(MERCHANT_ROUTES.ADD_EDIT_PRODUCT, { productId }),
    refetch,
    t,
  };
}
