import React from 'react';
import { View, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollScreenTemplate, Header, Input, Text, Button, Chip, Icon } from '@dawwar/ui';
import { useTheme, space, radius, AppColors } from '@dawwar/theme';
import { useController } from './useController';

export function AddEditProductScreen() {
  const { colors } = useTheme();
  const ctrl = useController();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollScreenTemplate
      header={
        <Header
          title={ctrl.productId ? ctrl.t('merchant.menu.editProduct') : ctrl.t('merchant.menu.addProduct')}
        />
      }
      edges={['bottom']}
      footer={
        <View style={{ padding: space.base }}>
          <Button
            label={ctrl.t('merchant.menu.save')}
            onPress={ctrl.handleSave}
            loading={ctrl.isLoading}
            disabled={ctrl.isButtonDisabled}
            fullWidth
            style={styles.saveButton}
          />
        </View>
      }
    >
      <View style={styles.formContainer}>
        <Input
          label={ctrl.t('merchant.menu.productName')}
          value={ctrl.nameAr}
          onChangeText={ctrl.setNameAr}
          placeholder="مثال: طماطم طازجة"
        />
        
        <Input
          label={ctrl.t('merchant.menu.description')}
          value={ctrl.description}
          onChangeText={ctrl.setDescription}
          placeholder={ctrl.t('merchant.menu.descriptionPlaceholder')}
          multiline
          numberOfLines={3}
        />

        <Input
          label={ctrl.t('merchant.menu.price')}
          value={ctrl.price}
          onChangeText={ctrl.setPrice}
          keyboardType="numeric"
          placeholder="0.00"
          rightIcon={<Text variant="label" color={colors.textSecondary}>{ctrl.t('merchant.common.currency')}</Text>}
        />

        <View style={styles.pickerContainer}>
          <Text variant="label" style={styles.pickerLabel}>{ctrl.t('merchant.menu.category')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {ctrl.categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.nameAr}
                selected={ctrl.categoryId === cat.id}
                onPress={() => ctrl.setCategoryId(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Availability toggle */}
        <View style={styles.toggleRow}>
          <Text variant="label" color={colors.text}>{ctrl.t('merchant.menu.available')}</Text>
          <Switch
            value={ctrl.isAvailable}
            onValueChange={ctrl.setIsAvailable}
            trackColor={{ false: colors.border, true: colors.primaryMuted }}
            thumbColor={ctrl.isAvailable ? colors.primary : colors.textDisabled}
          />
        </View>

        {/* Image picker */}
        <TouchableOpacity
          onPress={ctrl.handlePickImage}
          style={styles.imagePicker}
          activeOpacity={0.8}
        >
          {ctrl.imageUri ? (
            <FastImage
              source={{ uri: ctrl.imageUri }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="camera-plus-outline" size={32} color={colors.textDisabled} />
              <Text variant="caption" color={colors.textDisabled}>
                {ctrl.t('merchant.menu.addImage')}
              </Text>
            </View>
          )}
          {ctrl.imageUri && (
            <View style={styles.imageOverlay}>
              <Icon name="camera-flip-outline" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollScreenTemplate>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  formContainer: { padding: space.xl, gap: space.lg },
  saveButton: { height: 56, borderRadius: radius.lg },
  pickerContainer: { gap: space.sm },
  pickerLabel: { marginBottom: space.xs },
  chipsContainer: { gap: space.sm, paddingRight: space.xl },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  imagePicker: {
    width: 120, height: 120,
    borderRadius: radius.xl,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceVariant,
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  imageOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', padding: space.xs,
  },
});
