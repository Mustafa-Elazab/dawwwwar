import React from 'react';
import { View, Switch, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollScreenTemplate, Header, Input, Text, Button } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space } from '@dawwar/theme';
import { useController } from './useController';

export function AddEditProductScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      header={
        <Header
          title={ctrl.t('merchant_app.add_product')}
          leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }}
        />
      }
      edges={['bottom']}
      footer={
        <Button
          label={ctrl.t('merchant_app.save_product')}
          onPress={ctrl.handleSave}
          loading={ctrl.isLoading}
          disabled={ctrl.isButtonDisabled}
          fullWidth
          style={{ margin: space.base }}
        />
      }
    >
      <View style={{ padding: space.base, gap: space.md }}>
        <Input
          label={ctrl.t('merchant_app.product_name_ar')}
          value={ctrl.nameAr}
          onChangeText={ctrl.setNameAr}
          placeholder="مثال: طماطم طازجة"
        />
        <Input
          label={ctrl.t('merchant_app.product_name_en')}
          value={ctrl.name}
          onChangeText={ctrl.setName}
          placeholder="e.g. Fresh Tomatoes"
        />
        <Input
          label={ctrl.t('merchant_app.product_price')}
          value={ctrl.price}
          onChangeText={ctrl.setPrice}
          keyboardType="numeric"
          placeholder="0.00"
          rightIcon={<Text variant="label" color={colors.textSecondary}>{ctrl.t('common.egp')}</Text>}
        />
        {/* Availability toggle */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="label" color={colors.text}>{ctrl.t('merchant_app.product_available')}</Text>
          <Switch
            value={ctrl.isAvailable}
            onValueChange={ctrl.setIsAvailable}
            trackColor={{ false: colors.border, true: colors.primaryMuted }}
            thumbColor={ctrl.isAvailable ? colors.primary : colors.textDisabled}
          />
        </View>
        {/* Featured toggle */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="label" color={colors.text}>{ctrl.t('merchant_app.product_featured')}</Text>
          <Switch
            value={ctrl.isFeatured}
            onValueChange={ctrl.setIsFeatured}
            trackColor={{ false: colors.border, true: colors.primaryMuted }}
            thumbColor={ctrl.isFeatured ? colors.primary : colors.textDisabled}
          />
        </View>

        {/* Image picker */}
        <TouchableOpacity
          onPress={ctrl.handlePickImage}
          style={{
            width: 100, height: 100,
            borderRadius: 12,
            overflow: 'hidden',
            alignSelf: 'center',
            marginVertical: space.md,
          }}
        >
          <FastImage
            source={{ uri: ctrl.imageUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center', padding: 4,
          }}>
            <Text variant="caption" color="#fff">
              {ctrl.t('merchant_app.add_image')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollScreenTemplate>
  );
}
