import { useEffect, useState } from 'react';
import { useTranslation } from '@dawwar/i18n';

import {
  parseCurrencyInput,
  validateSavingsContributionDraft,
} from '../../../../core/planner/domain/phase1Logic';
import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import type {
  FarhaPhase1Event,
  FarhaPhase1SavingsContribution,
  SavingsContributionDraft,
} from '../../../../core/planner/domain/phase1Types';
import { confirmAction } from '../../../planner/utils/helpers';

interface SavingsContributionFormState {
  amount: string;
  date: string;
  note: string;
}

export function useController() {
  const appController = usePlannerController();
  const { t } = useTranslation();
  const event = appController.getEventById(appController.route.params?.eventId);
  const editingContribution = appController.getSavingsContributionById(
    appController.route.params?.contributionId,
  );
  const [form, setForm] = useState<SavingsContributionFormState>(
    contributionToForm(editingContribution),
  );
  const [submitted, setSubmitted] = useState(false);
  const draft = formToDraft(form, event, editingContribution);
  const validation = validateSavingsContributionDraft(draft);

  useEffect(() => {
    setForm(contributionToForm(editingContribution));
  }, [editingContribution]);

  const save = () => {
    setSubmitted(true);
    if (!event || !validation.isValid) return;
    appController.saveSavingsContribution(draft);
  };

  const deleteContribution = () => {
    if (!editingContribution) return;

    confirmAction(
      t('farha.phase1.confirm.deleteSavingsContribution'),
      () => appController.deleteSavingsContribution(editingContribution.id),
      t('farha.phase1.confirm.cancel'),
      t('farha.phase1.confirm.ok'),
    );
  };

  return {
    event,
    editingContribution,
    form,
    submitted,
    validation,
    setForm,
    save,
    deleteContribution,
  };
}

function contributionToForm(
  contribution?: FarhaPhase1SavingsContribution,
): SavingsContributionFormState {
  return {
    amount: contribution?.amount ? String(contribution.amount) : '',
    date: contribution?.date ?? new Date().toISOString().slice(0, 10),
    note: contribution?.note ?? '',
  };
}

function formToDraft(
  form: SavingsContributionFormState,
  event: FarhaPhase1Event | undefined,
  contribution: FarhaPhase1SavingsContribution | undefined,
): SavingsContributionDraft {
  return {
    id: contribution?.id,
    eventId: event?.id ?? '',
    amount: parseCurrencyInput(form.amount) ?? Number.NaN,
    date: form.date,
    note: form.note,
  };
}
