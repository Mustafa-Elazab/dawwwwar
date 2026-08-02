import { useState } from 'react';

import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { validateEventDraft } from '../../../../core/planner/domain/phase1Logic';
import { defaultEventForm, type EventFormState } from '../../utils/eventForm';

export function useController() {
  const appController = usePlannerController();
  const [form, setForm] = useState<EventFormState>(defaultEventForm);
  const [submitted, setSubmitted] = useState(false);
  const draft = { ...form };
  const validation = validateEventDraft(draft);

  const submit = () => {
    setSubmitted(true);
    if (!validation.isValid) return;
    appController.createEvent(draft);
  };

  return {
    form,
    submitted,
    setForm,
    submit,
  };
}
