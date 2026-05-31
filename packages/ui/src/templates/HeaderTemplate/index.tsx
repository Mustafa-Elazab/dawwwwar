import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@dawwar/theme';
import { Header } from '../../organisms/Header';
import { createStyles } from './styles';
import type { HeaderTemplateProps } from './types';

export function HeaderTemplate({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  leftAction,
  rightAction,
  leftComponent,
  rightComponent,
  actions,
  searchSlot,
  transparent = false,
  style,
  testID,
}: HeaderTemplateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  const resolvedOnBackPress = onBackPress ?? (() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  });

  return (
    <View
      style={[
        styles.root,
        transparent && styles.rootTransparent,
        style,
      ]}
      testID={testID}
    >
      <Header
        title={title}
        subtitle={subtitle}
        leftAction={leftAction}
        rightAction={rightAction}
        leftComponent={leftComponent}
        rightComponent={actions ?? rightComponent}
        type={showBack ? 'default' : 'none'}
        onBackPress={resolvedOnBackPress}
        transparent={transparent}
        style={styles.header}
      />
      {searchSlot ? <View style={styles.searchSlot}>{searchSlot}</View> : null}
    </View>
  );
}
