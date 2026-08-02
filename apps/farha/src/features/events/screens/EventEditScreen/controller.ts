import { useEffect, useState } from 'react';
import { useTranslation } from '@dawwar/i18n';

import { usePlannerController } from '../../../planner/context/PlannerControllerContext';
import { validateEventDraft } from '../../../planner/domain/phase1Logic';
import {
  confirmAction,
  getScreenEvent,
} from '../../../planner/utils/helpers';
import { eventToForm, type EventFormState } from '../../utils/eventForm';

export function useController() {
  const appController = usePlannerController();
  const { t } = useTranslation();
  const event = getScreenEvent(appController);
  const [form, setForm] = useState<EventFormState>(eventToForm(event));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setForm(eventToForm(event)), [event]);

  const draft = event ? { id: event.id, ...form } : undefined;
  const validation = validateEventDraft(draft ?? form);

  const save = () => {
    setSubmitted(true);
    if (!draft || !validation.isValid) return;
    appController.updateEvent(draft);
  };

  const deleteEvent = () => {
    if (!event) return;

    confirmAction(
      t('farha.phase1.confirm.deleteEvent'),
      () => appController.deleteEvent(event.id),
      t('farha.phase1.confirm.cancel'),
      t('farha.phase1.confirm.ok'),
    );
  };

  return {
    event,
    form,
    submitted,
    setForm,
    save,
    deleteEvent,
  };
}
