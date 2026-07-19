import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@dawwar/theme';
import { ModalSheetTemplate } from '../../templates/ModalSheetTemplate';
import { AddressCard } from '../AddressCard';
import { AppButton } from '../../atoms';

export interface LocationSelectorAddress {
  id: string;
  label: string;
  address: string;
}

export interface LocationSelectorSheetProps {
  visible: boolean;
  title: string;
  savedLocationsTitle: string;
  currentLocationLabel: string;
  differentLocationLabel: string;
  selectedAddressId?: string;
  addresses: LocationSelectorAddress[];
  onClose: () => void;
  onSelectAddress: (address: LocationSelectorAddress) => void;
  onUseCurrentLocation: () => void;
  onDifferentLocation: () => void;
}

export function LocationSelectorSheet({
  visible,
  title,
  savedLocationsTitle,
  currentLocationLabel,
  differentLocationLabel,
  selectedAddressId,
  addresses,
  onClose,
  onSelectAddress,
  onUseCurrentLocation,
  onDifferentLocation,
}: LocationSelectorSheetProps) {
  return (
    <ModalSheetTemplate visible={visible} title={title} onClose={onClose}>
      <View style={styles.content}>
        <AppButton
          label={currentLocationLabel}
          onPress={onUseCurrentLocation}
          variant="secondary"
          fullWidth
        />
        <AppButton
          label={differentLocationLabel}
          onPress={onDifferentLocation}
          variant="outline"
          fullWidth
        />
        <View style={styles.list}>
          <AppButton label={savedLocationsTitle} variant="ghost" disabled fullWidth />
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              label={address.label}
              address={address.address}
              selected={address.id === selectedAddressId}
              onPress={() => onSelectAddress(address)}
            />
          ))}
        </View>
      </View>
    </ModalSheetTemplate>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing[3],
  },
  list: {
    gap: spacing[2],
    marginTop: spacing[2],
  },
});
