import React from 'react';
import { ScrollScreenTemplate } from '@dawwar/ui';
import { CompleteProfileFooter, CompleteProfileForm } from './components/CompleteProfileForm';
import { ProfileFormHeader } from './components/ProfileFormHeader';
import { useController } from './useController';

export function CompleteProfileScreen() {
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      header={
        <ProfileFormHeader
          title={ctrl.labels.title}
          isRTL={ctrl.isRTL}
          colors={ctrl.colors}
          styles={ctrl.styles}
          onBack={ctrl.handlers.handleBack}
        />
      }
      footer={
        <CompleteProfileFooter
          labels={ctrl.labels}
          isLoading={ctrl.isLoading}
          isContinueDisabled={ctrl.isContinueDisabled}
          styles={ctrl.styles}
          onContinue={ctrl.handlers.handleSave}
          onSkip={ctrl.handlers.handleSkip}
        />
      }
      contentStyle={ctrl.styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <CompleteProfileForm
        labels={ctrl.labels}
        values={ctrl.values}
        errors={ctrl.errors}
        isRTL={ctrl.isRTL}
        colors={ctrl.colors}
        styles={ctrl.styles}
        isLoading={ctrl.isLoading}
        datePicker={ctrl.datePicker}
        handlers={ctrl.handlers}
      />
    </ScrollScreenTemplate>
  );
}
