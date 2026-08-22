import { useState } from 'react';

import { usePlannerController } from '../../../../core/planner/context/PlannerControllerContext';
import { validateEventDraft } from '../../../../core/planner/domain/phase1Logic';
import { defaultEventForm, type EventFormState } from '../../utils/eventForm';
import { pickOccasionCoverPhoto } from '../../utils/coverPhotoPicker';

export function useController() {
  const appController = usePlannerController();
  const [form, setForm] = useState<EventFormState>(defaultEventForm);
  const [submitted, setSubmitted] = useState(false);
  const [photoErrorKey, setPhotoErrorKey] = useState<string | undefined>();
  const draft = { ...form };
  const validation = validateEventDraft(draft);

  const submit = () => {
    setSubmitted(true);
    if (!validation.isValid) return;
    appController.createEvent(draft);
  };

  const pickCoverPhoto = async () => {
    try {
      setPhotoErrorKey(undefined);
      const coverPhotoUri = await pickOccasionCoverPhoto();
      if (coverPhotoUri) setForm((current) => ({ ...current, coverPhotoUri }));
    } catch {
      setPhotoErrorKey('farha.phase1.errors.photoPicker');
    }
  };

  return {
    form,
    submitted,
    photoErrorKey,
    setForm,
    pickCoverPhoto,
    removeCoverPhoto: () => setForm((current) => ({ ...current, coverPhotoUri: undefined })),
    submit,
  };
}
