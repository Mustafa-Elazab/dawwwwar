import { useState } from 'react';

import { validateEventDraft } from '../../planner/domain/phase1Logic';
import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';
import { defaultEventForm, type EventFormState } from '../utils/eventForm';

export function useController(appController: Phase1PlannerController) {
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
