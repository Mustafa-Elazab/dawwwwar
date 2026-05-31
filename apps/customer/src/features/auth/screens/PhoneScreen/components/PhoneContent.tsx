import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Button, Icon, Text } from '@dawwar/ui';
import RTLTextInput from '../../../../../components/RTLTextInput';
import { createStyles } from '../styles';

interface PhoneContentProps {
  colors: AppColors;
  brand: string;
  tagline: string;
  phoneLabel: string;
  phonePlaceholder: string;
  termsPrefix: string;
  termsLink: string;
  termsSuffix: string;
  privacyLink: string;
  termsHint: string;
  sandboxHint: string;
  sendLabel: string;
  sendingLabel: string;
  phone: string;
  phoneError: string | null;
  termsAccepted: boolean;
  isLoading: boolean;
  isButtonDisabled: boolean;
  onPhoneChange: (text: string) => void;
  onTermsToggle: () => void;
  onTermsPress: () => void;
  onPrivacyPress: () => void;
  onSendOtp: () => void;
}

export function PhoneContent({
  colors,
  brand,
  tagline,
  phoneLabel,
  phonePlaceholder,
  termsPrefix,
  termsLink,
  termsSuffix,
  privacyLink,
  termsHint,
  sandboxHint,
  sendLabel,
  sendingLabel,
  phone,
  phoneError,
  termsAccepted,
  isLoading,
  isButtonDisabled,
  onPhoneChange,
  onTermsToggle,
  onTermsPress,
  onPrivacyPress,
  onSendOtp,
}: PhoneContentProps) {
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.illustrationArea}>
        <Text style={styles.logoText}>{brand}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.formTitle}>{phoneLabel}</Text>

        <View style={[styles.phoneRow, phoneError ? styles.phoneRowError : null]}>
          <View style={styles.countryPrefix}>
            <Text style={styles.prefixFlag}>{'🇪🇬'}</Text>
            <Text style={styles.prefixCode}>{'+20'}</Text>
          </View>

          <RTLTextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={onPhoneChange}
            placeholder={phonePlaceholder}
            placeholderTextColor={colors.placeholder}
            keyboardType="phone-pad"
            maxLength={11}
            returnKeyType="done"
            onSubmitEditing={onSendOtp}
            autoFocus
          />
        </View>

        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <View style={styles.termsRow}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={onTermsToggle}
            activeOpacity={0.8}
            testID="terms-checkbox"
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
              {termsAccepted ? (
                <Icon name="check" size={14} color={colors.primaryText} />
              ) : null}
            </View>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            {termsPrefix}
            <Text style={styles.termsLink} onPress={onTermsPress}>{termsLink}</Text>
            {termsSuffix}
            <Text style={styles.termsLink} onPress={onPrivacyPress}>{privacyLink}</Text>
          </Text>
        </View>

        <View style={styles.spacer} />

        <Button
          label={isLoading ? sendingLabel : sendLabel}
          onPress={onSendOtp}
          loading={isLoading}
          disabled={isButtonDisabled}
          fullWidth
          style={[
            styles.sendButton,
            isButtonDisabled && styles.sendButtonDisabled,
          ]}
        />

        {!termsAccepted ? <Text style={styles.termsHint}>{termsHint}</Text> : null}
        <Text style={styles.hintText}>{sandboxHint}</Text>
      </View>
    </View>
  );
}
