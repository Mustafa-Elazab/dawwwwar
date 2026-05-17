import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Input, Button } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space } from '@dawwar/theme';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectUser, updateUser } from '../../../store/slices/auth.slice';
import { useUpdateProfile } from '@dawwar/api-client';
import Toast from 'react-native-toast-message';

export function EditProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const updateMutation = useUpdateProfile();

  const [name, setName] = useState(user?.name ?? '');

  // Phone editing usually requires OTP verification, keeping it read-only here for now
  // or implementing full OTP flow if needed.
  const phone = user?.phone ?? '';

  const handleSave = () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: t('errors.required') });
      return;
    }
    
    updateMutation.mutate({ name }, {
      onSuccess: () => {
        dispatch(updateUser({ name }));
        Toast.show({ type: 'success', text1: t('auth.profile_updated') });
        navigation.goBack();
      },
      onError: () => Toast.show({ type: 'error', text1: t('errors.server') }),
    });
  };

  return (
    <ScrollScreenTemplate
      headerProps={{ title: t('profile.edit_profile') }}
      footer={
        <Button
          label={t('common.save')}
          onPress={handleSave}
          loading={updateMutation.isPending}
          disabled={!name.trim() || updateMutation.isPending}
          size='md'
          style={{marginHorizontal:space.md}}
        />
      }
    >
      <View style={{ padding: space.base, gap: space.md }}>
        <Input 
          label={t('auth.name_label')} 
          value={name} 
          onChangeText={setName} 
          placeholder={t('auth.name_placeholder')} 
        />
        <Input 
          label={t('auth.phone_label')} 
          value={phone} 
          editable={false} 
        />
      </View>
    </ScrollScreenTemplate>
  );
}