import { useMutation } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import type { ValidatePromoPayload } from '../../services/promotions.service';

export function useValidatePromo() {
  const { promotions } = useApiClient();

  return useMutation({
    mutationFn: (payload: ValidatePromoPayload) => promotions.validatePromo(payload),
  });
}
