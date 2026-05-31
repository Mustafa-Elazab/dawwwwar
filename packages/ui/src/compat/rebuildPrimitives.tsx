import React, { useMemo } from 'react';
import {
  I18nManager,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@dawwar/theme';
import {
  createFigmaColors,
  figmaRadius as radius,
  figmaShadows as shadows,
  figmaSpacing as spacing,
  figmaTypography as typography,
  type FigmaColorTokens,
} from '../theme';

export type PressHandler = () => void;
type TranslationOptions = Record<string, unknown>;
type IconName = string;

type LocalizedLabel = {
  tx?: string;
  text?: string;
  tOptions?: TranslationOptions;
};

function useFigmaTokens() {
  const theme = useTheme();

  return useMemo(
    () => ({
      ...theme,
      figmaColors: createFigmaColors(theme.colors),
      isRTL: I18nManager.isRTL,
    }),
    [theme],
  );
}

function useLocalizedText(label: LocalizedLabel) {
  const { t } = useTranslation();
  if (label.tx) return t(label.tx, label.tOptions);
  return label.text;
}

function mirrorStyle(shouldMirror?: boolean): StyleProp<ViewStyle> {
  return shouldMirror && I18nManager.isRTL ? styles.mirrored : null;
}

export type FigmaTextProps = TextProps &
  LocalizedLabel & {
    variant?: keyof typeof typography;
    color?: keyof FigmaColorTokens;
    align?: TextStyle['textAlign'];
    children?: React.ReactNode;
  };

export function FigmaText({
  tx,
  text,
  tOptions,
  variant = 'body',
  color = 'text',
  align = 'auto',
  style,
  children,
  ...props
}: FigmaTextProps) {
  const { figmaColors } = useFigmaTokens();
  const translated = useLocalizedText({ tx, text, tOptions });

  return (
    <Text
      {...props}
      style={[typography[variant], { color: figmaColors[color], textAlign: align }, style]}
    >
      {children ?? translated}
    </Text>
  );
}

export type FigmaSurfaceProps = {
  children?: React.ReactNode;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FigmaSurface({ children, elevated, style }: FigmaSurfaceProps) {
  const { figmaColors } = useFigmaTokens();

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: figmaColors.surface,
          borderColor: figmaColors.border,
          borderRadius: radius.card,
        },
        elevated ? shadows.card : shadows.none,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function FigmaCard({ children, style }: FigmaSurfaceProps) {
  return (
    <FigmaSurface elevated style={[styles.card, style]}>
      {children}
    </FigmaSurface>
  );
}

export type FigmaSectionProps = {
  titleTx?: string;
  title?: string;
  actionTx?: string;
  action?: string;
  onActionPress?: PressHandler;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function FigmaSection({
  titleTx,
  title,
  actionTx,
  action,
  onActionPress,
  children,
  style,
}: FigmaSectionProps) {
  return (
    <View style={[styles.section, style]}>
      {(titleTx || title || actionTx || action) ? (
        <View style={styles.sectionHeader}>
          {titleTx || title ? <FigmaText tx={titleTx} text={title} variant="bodyStrong" /> : <View />}
          {actionTx || action ? (
            <Pressable onPress={onActionPress} hitSlop={spacing.sm}>
              <FigmaText tx={actionTx} text={action} variant="label" color="brand" />
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export type FigmaButtonProps = LocalizedLabel & {
  onPress?: PressHandler;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabelTx?: string;
};

export function FigmaButton({
  tx,
  text,
  tOptions,
  onPress,
  disabled,
  variant = 'primary',
  size = 'lg',
  icon,
  iconPosition = 'start',
  style,
  textStyle,
  accessibilityLabelTx,
}: FigmaButtonProps) {
  const { figmaColors } = useFigmaTokens();
  const label = useLocalizedText({ tx, text, tOptions });
  const accessibilityLabel = useLocalizedText({ tx: accessibilityLabelTx });
  const buttonColors = getButtonColors(figmaColors, variant, disabled);
  const iconNode = icon ? (
    <Icon name={icon} size={size === 'sm' ? 18 : 22} color={buttonColors.text} />
  ) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        styles[`button_${size}`],
        {
          backgroundColor: buttonColors.background,
          borderColor: buttonColors.border,
          borderRadius: radius.pill,
        },
        variant === 'primary' && !disabled ? shadows.card : shadows.none,
        style,
      ]}
    >
      {iconPosition === 'start' ? iconNode : null}
      <FigmaText variant="bodyStrong" color={buttonColors.textToken} style={textStyle}>
        {label}
      </FigmaText>
      {iconPosition === 'end' ? iconNode : null}
    </Pressable>
  );
}

function getButtonColors(
  colors: FigmaColorTokens,
  variant: NonNullable<FigmaButtonProps['variant']>,
  disabled?: boolean,
) {
  if (disabled) {
    return {
      background: colors.brandSoft,
      border: colors.brandSoft,
      text: colors.textSubtle,
      textToken: 'textSubtle' as const,
    };
  }

  if (variant === 'outline') {
    return {
      background: colors.surface,
      border: colors.borderStrong,
      text: colors.brand,
      textToken: 'brand' as const,
    };
  }

  if (variant === 'ghost') {
    return {
      background: 'transparent',
      border: 'transparent',
      text: colors.brand,
      textToken: 'brand' as const,
    };
  }

  if (variant === 'danger') {
    return {
      background: colors.error,
      border: colors.error,
      text: colors.textInverse,
      textToken: 'textInverse' as const,
    };
  }

  if (variant === 'secondary') {
    return {
      background: colors.brandSoft,
      border: colors.brandSoft,
      text: colors.brand,
      textToken: 'brand' as const,
    };
  }

  return {
    background: colors.brand,
    border: colors.brand,
    text: colors.textInverse,
    textToken: 'textInverse' as const,
  };
}

export type FigmaInputProps = Omit<TextInputProps, 'placeholder'> &
  LocalizedLabel & {
    placeholderTx?: string;
    placeholderText?: string;
    leadingIcon?: IconName;
    trailing?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    errorTx?: string;
    errorText?: string;
  };

export function FigmaInput({
  tx,
  text,
  tOptions,
  placeholderTx,
  placeholderText,
  leadingIcon,
  trailing,
  containerStyle,
  errorTx,
  errorText,
  style,
  value,
  editable = true,
  ...props
}: FigmaInputProps) {
  const { figmaColors } = useFigmaTokens();
  const placeholder = useLocalizedText({ tx: placeholderTx, text: placeholderText });
  const fallbackValue = useLocalizedText({ tx, text, tOptions });
  const error = useLocalizedText({ tx: errorTx, text: errorText });

  return (
    <View>
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: figmaColors.field,
            borderColor: error ? figmaColors.error : figmaColors.border,
            borderRadius: radius.control,
          },
          containerStyle,
        ]}
      >
        {leadingIcon ? <Icon name={leadingIcon} size={20} color={figmaColors.icon} /> : null}
        <TextInput
          {...props}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={figmaColors.textSubtle}
          value={value ?? fallbackValue}
          style={[styles.input, typography.body, { color: figmaColors.text, textAlign: 'auto' }, style]}
        />
        {trailing}
      </View>
      {error ? <FigmaText variant="caption" color="error" style={styles.inputError}>{error}</FigmaText> : null}
    </View>
  );
}

export type FigmaOTPInputProps = {
  value: string;
  length?: number;
  onChangeText?: (value: string) => void;
  errorTx?: string;
  errorText?: string;
  style?: StyleProp<ViewStyle>;
};

export function FigmaOTPInput({
  value,
  length = 6,
  onChangeText,
  errorTx,
  errorText,
  style,
}: FigmaOTPInputProps) {
  const { figmaColors } = useFigmaTokens();
  const error = useLocalizedText({ tx: errorTx, text: errorText });
  const cells = Array.from({ length }, (_, index) => value[index] ?? '');

  return (
    <View style={style}>
      <Pressable style={styles.otpRow}>
        {cells.map((digit, index) => (
          <View
            key={`${index}-${digit}`}
            style={[
              styles.otpCell,
              {
                backgroundColor: figmaColors.field,
                borderColor: error ? figmaColors.error : figmaColors.border,
                borderRadius: radius.control,
              },
            ]}
          >
            <FigmaText variant="header">{digit}</FigmaText>
          </View>
        ))}
      </Pressable>
      <TextInput
        accessibilityLabel="OTP"
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        value={value}
        onChangeText={onChangeText}
        style={styles.hiddenInput}
      />
      {error ? <FigmaText variant="caption" color="error" style={styles.inputError}>{error}</FigmaText> : null}
    </View>
  );
}

export type FigmaBottomSheetProps = {
  children?: React.ReactNode;
  visible?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FigmaBottomSheet({ children, visible = true, style }: FigmaBottomSheetProps) {
  const { figmaColors } = useFigmaTokens();
  const insets = useSafeAreaInsets();
  if (!visible) return null;

  return (
    <View style={[styles.sheetBackdrop, { backgroundColor: figmaColors.overlay }]}>
      <View
        style={[
          styles.sheet,
          {
            paddingBottom: Math.max(insets.bottom, spacing.base),
            backgroundColor: figmaColors.surface,
            borderTopStartRadius: radius.sheet,
            borderTopEndRadius: radius.sheet,
          },
          shadows.sheet,
          style,
        ]}
      >
        <View style={[styles.sheetHandle, { backgroundColor: figmaColors.borderStrong }]} />
        {children}
      </View>
    </View>
  );
}

export type FigmaHeaderProps = {
  titleTx?: string;
  title?: string;
  subtitleTx?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: PressHandler;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  floating?: boolean;
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FigmaHeader({
  titleTx,
  title,
  subtitleTx,
  subtitle,
  showBack,
  onBack,
  rightAction,
  transparent,
  floating,
  safeArea = true,
  style,
}: FigmaHeaderProps) {
  const { figmaColors } = useFigmaTokens();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: safeArea ? insets.top : 0,
          backgroundColor: transparent ? 'transparent' : figmaColors.background,
        },
        floating ? [styles.headerFloating, { backgroundColor: figmaColors.surface }, shadows.floating] : null,
        style,
      ]}
    >
      <View style={styles.headerRow}>
        {showBack ? (
          <FigmaIconButton
            icon="arrow-left"
            onPress={onBack}
            mirrorInRTL
            accessibilityLabelTx="common.back"
          />
        ) : (
          <View style={styles.headerSlot} />
        )}
        <View style={styles.headerTitle}>
          {titleTx || title ? <FigmaText tx={titleTx} text={title} variant="header" numberOfLines={1} /> : null}
          {subtitleTx || subtitle ? (
            <FigmaText tx={subtitleTx} text={subtitle} variant="caption" color="textMuted" numberOfLines={1} />
          ) : null}
        </View>
        <View style={styles.headerSlot}>{rightAction}</View>
      </View>
    </View>
  );
}

export type FigmaTabItem = LocalizedLabel & {
  key: string;
  icon: IconName;
  accessibilityLabelTx?: string;
};

export type FigmaTabBarProps = {
  tabs: FigmaTabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
  style?: StyleProp<ViewStyle>;
};

export function FigmaTabBar({ tabs, activeKey, onTabPress, style }: FigmaTabBarProps) {
  const { figmaColors, isRTL } = useFigmaTokens();
  const insets = useSafeAreaInsets();
  const orderedTabs = isRTL ? [...tabs].reverse() : tabs;

  return (
    <View style={[styles.tabWrap, { paddingBottom: Math.max(insets.bottom, spacing.md) }, style]}>
      <View style={[styles.tabBar, { backgroundColor: figmaColors.tabBar, borderRadius: radius.floating }, shadows.floating]}>
        {orderedTabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onTabPress(tab.key)}
              style={styles.tabItem}
            >
              <View style={[styles.tabIcon, active && { backgroundColor: figmaColors.brand }]}>
                <Icon name={tab.icon} size={21} color={active ? figmaColors.textInverse : figmaColors.icon} />
              </View>
              <FigmaText
                tx={tab.tx}
                text={tab.text}
                tOptions={tab.tOptions}
                variant="tiny"
                color={active ? 'brand' : 'textSubtle'}
                numberOfLines={1}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export type FigmaBadgeProps = LocalizedLabel & {
  tone?: 'brand' | 'success' | 'warning' | 'error' | 'neutral';
  style?: StyleProp<ViewStyle>;
};

export function FigmaBadge({ tone = 'brand', style, ...label }: FigmaBadgeProps) {
  const { figmaColors } = useFigmaTokens();
  const toneColors = getToneColors(figmaColors, tone);

  return (
    <View style={[styles.badge, { backgroundColor: toneColors.background, borderRadius: radius.pill }, style]}>
      <FigmaText {...label} variant="tiny" color={toneColors.textToken} />
    </View>
  );
}

export type FigmaChipProps = FigmaBadgeProps & {
  selected?: boolean;
  onPress?: PressHandler;
  icon?: IconName;
};

export function FigmaChip({ selected, onPress, icon, tone = 'neutral', style, ...label }: FigmaChipProps) {
  const { figmaColors } = useFigmaTokens();
  const activeTone = selected ? 'brand' : tone;
  const toneColors = getToneColors(figmaColors, activeTone);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: toneColors.background,
          borderColor: selected ? figmaColors.brand : figmaColors.border,
          borderRadius: radius.pill,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={toneColors.icon} /> : null}
      <FigmaText {...label} variant="caption" color={toneColors.textToken} />
    </Pressable>
  );
}

function getToneColors(colors: FigmaColorTokens, tone: NonNullable<FigmaBadgeProps['tone']>) {
  if (tone === 'success') {
    return { background: colors.successSoft, icon: colors.success, textToken: 'success' as const };
  }
  if (tone === 'warning') {
    return { background: colors.warningSoft, icon: colors.warning, textToken: 'warning' as const };
  }
  if (tone === 'error') {
    return { background: colors.errorSoft, icon: colors.error, textToken: 'error' as const };
  }
  if (tone === 'neutral') {
    return { background: colors.field, icon: colors.icon, textToken: 'textMuted' as const };
  }
  return { background: colors.brandSoft, icon: colors.brand, textToken: 'brand' as const };
}

export type FigmaDividerProps = {
  inset?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FigmaDivider({ inset, style }: FigmaDividerProps) {
  const { figmaColors } = useFigmaTokens();
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: figmaColors.border,
          marginStart: inset ? spacing.base : 0,
          marginEnd: inset ? spacing.base : 0,
        },
        style,
      ]}
    />
  );
}

export type FigmaIconButtonProps = {
  icon: IconName;
  onPress?: PressHandler;
  active?: boolean;
  disabled?: boolean;
  mirrorInRTL?: boolean;
  accessibilityLabelTx?: string;
  style?: StyleProp<ViewStyle>;
};

export function FigmaIconButton({
  icon,
  onPress,
  active,
  disabled,
  mirrorInRTL,
  accessibilityLabelTx,
  style,
}: FigmaIconButtonProps) {
  const { figmaColors } = useFigmaTokens();
  const accessibilityLabel = useLocalizedText({ tx: accessibilityLabelTx });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.iconButton,
        {
          backgroundColor: active ? figmaColors.brand : figmaColors.surface,
          borderRadius: radius.circle,
        },
        shadows.card,
        style,
      ]}
    >
      <View style={mirrorStyle(mirrorInRTL)}>
        <Icon name={icon} size={22} color={active ? figmaColors.textInverse : figmaColors.text} />
      </View>
    </Pressable>
  );
}

export type FigmaFloatingCTAProps = FigmaButtonProps & {
  bottomOffset?: number;
};

export function FigmaFloatingCTA({ style, bottomOffset, ...props }: FigmaFloatingCTAProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.floatingCTA,
        { paddingBottom: bottomOffset ?? Math.max(insets.bottom, spacing.base) },
      ]}
    >
      <FigmaButton {...props} style={style} />
    </View>
  );
}

export type FigmaScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
};

export function FigmaScreen({ children, scroll = true, contentStyle, footer }: FigmaScreenProps) {
  const { figmaColors } = useFigmaTokens();
  const insets = useSafeAreaInsets();
  const content = [
    styles.screenContent,
    { paddingBottom: footer ? spacing.xxl * 4 : spacing.xl + insets.bottom },
    contentStyle,
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: figmaColors.background }]} edges={['top']}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={content}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[content, styles.screenFill]}>{children}</View>
      )}
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: figmaColors.surface,
              borderRadius: radius.card,
              paddingBottom: Math.max(insets.bottom, spacing.md),
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export function TopBar({
  title,
  titleTx,
  onBack,
  right,
}: {
  title?: string;
  titleTx?: string;
  onBack?: PressHandler;
  right?: React.ReactNode;
}) {
  return <FigmaHeader title={title} titleTx={titleTx} showBack onBack={onBack} safeArea={false} rightAction={right} />;
}

export function CircleButton(props: FigmaIconButtonProps) {
  return <FigmaIconButton {...props} />;
}

export function PrimaryButton({
  label,
  labelTx,
  outline,
  ...props
}: Omit<FigmaButtonProps, 'text' | 'tx' | 'variant'> & {
  label?: string;
  labelTx?: string;
  outline?: boolean;
}) {
  return <FigmaButton {...props} text={label} tx={labelTx} variant={outline ? 'outline' : 'primary'} />;
}

export function SearchField({
  value,
  valueTx,
  compact,
}: {
  value?: string;
  valueTx?: string;
  compact?: boolean;
}) {
  const { figmaColors } = useFigmaTokens();
  return (
    <FigmaInput
      leadingIcon="magnify"
      tx={valueTx}
      text={value}
      placeholderTx="common.search"
      trailing={<Icon name="tune-variant" size={19} color={figmaColors.icon} />}
      containerStyle={compact ? styles.searchCompact : null}
      editable={false}
    />
  );
}

export function PhoneField({ value }: { value?: string }) {
  return <FigmaInput value={value} placeholderTx="auth.phonePlaceholder" keyboardType="phone-pad" leadingIcon="phone-outline" />;
}

export function CheckRow({ checked, label, labelTx }: { checked?: boolean; label?: string; labelTx?: string }) {
  const { figmaColors } = useFigmaTokens();
  return (
    <View style={styles.checkRow}>
      <View
        style={[
          styles.checkBox,
          {
            borderColor: checked ? figmaColors.brand : figmaColors.borderStrong,
            backgroundColor: checked ? figmaColors.brand : 'transparent',
            borderRadius: radius.control,
          },
        ]}
      >
        {checked ? <Icon name="check" size={14} color={figmaColors.textInverse} /> : null}
      </View>
      <FigmaText tx={labelTx} text={label} />
    </View>
  );
}

export function SectionHeader({ title, titleTx, action, actionTx }: { title?: string; titleTx?: string; action?: string; actionTx?: string }) {
  return <FigmaSection title={title} titleTx={titleTx} action={action} actionTx={actionTx} />;
}

export function CircleMini({ label }: { label: string }) {
  return <FigmaChip text={label} />;
}

export function SummaryRow({ label, labelTx, value, compact }: { label?: string; labelTx?: string; value: string; compact?: boolean }) {
  return (
    <View style={[styles.summaryRow, compact && styles.summaryRowCompact]}>
      <FigmaText tx={labelTx} text={label} variant={compact ? 'caption' : 'body'} />
      <FigmaText text={value} variant={compact ? 'caption' : 'bodyStrong'} color="brand" />
    </View>
  );
}

export function SettingsRow({
  icon,
  label,
  labelTx,
  value,
  toggle,
}: {
  icon?: string;
  label?: string;
  labelTx?: string;
  value?: string;
  toggle?: boolean;
}) {
  const { figmaColors } = useFigmaTokens();
  return (
    <FigmaCard style={styles.settingsRow}>
      {icon ? <Icon name={icon} size={18} color={figmaColors.icon} /> : null}
      <FigmaText tx={labelTx} text={label} style={styles.flex} />
      {toggle ? (
        <Switch
          value={false}
          disabled
          trackColor={{ false: figmaColors.border, true: figmaColors.brandSoft }}
          thumbColor={figmaColors.surface}
        />
      ) : (
        <>
          {value ? <FigmaBadge text={value} tone="neutral" /> : null}
          <View style={mirrorStyle(true)}>
            <Icon name="chevron-right" size={22} color={figmaColors.text} />
          </View>
        </>
      )}
    </FigmaCard>
  );
}

export function ProductImage({ emoji, large }: { emoji?: string; large?: boolean }) {
  const { figmaColors } = useFigmaTokens();
  return (
    <View
      style={[
        styles.productImage,
        large && styles.productImageLarge,
        { backgroundColor: figmaColors.field, borderRadius: radius.control },
      ]}
    >
      {emoji ? <FigmaText style={large ? styles.productEmojiLarge : styles.productEmoji}>{emoji}</FigmaText> : null}
    </View>
  );
}

export function CategoryTile({
  emoji,
  label,
  labelTx,
  onPress,
}: {
  emoji?: string;
  label?: string;
  labelTx?: string;
  onPress?: PressHandler;
}) {
  return (
    <Pressable onPress={onPress}>
      <FigmaCard style={styles.categoryTile}>
        {emoji ? <FigmaText style={styles.categoryEmoji}>{emoji}</FigmaText> : null}
        <FigmaText tx={labelTx} text={label} variant="label" align="center" numberOfLines={2} />
      </FigmaCard>
    </Pressable>
  );
}

export function CategoryGrid({
  categories = [],
  limit,
  onPress,
}: {
  categories?: Array<{ id?: string; emoji?: string; label?: string; labelTx?: string }>;
  limit?: number;
  onPress?: PressHandler;
}) {
  const visible = typeof limit === 'number' ? categories.slice(0, limit) : categories;
  return (
    <View style={styles.grid}>
      {visible.map((category, index) => (
        <CategoryTile
          key={category.id ?? `${category.labelTx ?? category.label ?? index}`}
          emoji={category.emoji}
          label={category.label}
          labelTx={category.labelTx}
          onPress={onPress}
        />
      ))}
    </View>
  );
}

export function ProductCard({
  product,
  onPress,
}: {
  product: { id?: string; name?: string; nameTx?: string; price?: string; oldPrice?: string; emoji?: string };
  onPress?: PressHandler;
}) {
  const { figmaColors } = useFigmaTokens();
  return (
    <Pressable onPress={onPress}>
      <FigmaCard style={styles.productCard}>
        <ProductImage emoji={product.emoji} />
        <View style={[styles.favoriteDot, { backgroundColor: figmaColors.surface, borderRadius: radius.circle }]}>
          <Icon name="heart-outline" size={13} color={figmaColors.brand} />
        </View>
        <FigmaText tx={product.nameTx} text={product.name} variant="tiny" numberOfLines={1} />
        <View style={styles.priceRow}>
          {product.oldPrice ? <FigmaText text={product.oldPrice} variant="caption" color="textSubtle" /> : null}
          {product.price ? <FigmaText text={product.price} variant="caption" color="brand" /> : null}
        </View>
      </FigmaCard>
    </Pressable>
  );
}

export function ProductGrid({
  products = [],
  onProductPress,
}: {
  products?: Array<{ id?: string; name?: string; nameTx?: string; price?: string; oldPrice?: string; emoji?: string }>;
  onProductPress?: PressHandler;
}) {
  return (
    <View style={styles.productGrid}>
      {products.map((product, index) => (
        <ProductCard key={product.id ?? `${product.nameTx ?? product.name ?? index}`} product={product} onPress={onProductPress} />
      ))}
    </View>
  );
}

export function HomeBanner({
  title,
  titleTx,
  subtitle,
  subtitleTx,
  emoji,
}: {
  selected?: boolean;
  title?: string;
  titleTx?: string;
  subtitle?: string;
  subtitleTx?: string;
  emoji?: string;
}) {
  const { figmaColors } = useFigmaTokens();
  return (
    <View style={[styles.banner, { backgroundColor: figmaColors.brandSoft, borderRadius: radius.card }]}>
      <View style={styles.flex}>
        <FigmaText tx={titleTx} text={title} variant="header" color="brand" />
        {subtitleTx || subtitle ? <FigmaText tx={subtitleTx} text={subtitle} color="textMuted" /> : null}
      </View>
      {emoji ? <FigmaText style={styles.bannerEmoji}>{emoji}</FigmaText> : null}
    </View>
  );
}

export function BasketItem({
  name,
  nameTx,
  price,
  oldPrice,
  emoji,
  additions,
}: {
  name?: string;
  nameTx?: string;
  price?: string;
  oldPrice?: string;
  emoji?: string;
  additions?: boolean;
}) {
  return (
    <FigmaCard style={styles.basketItem}>
      <ProductImage emoji={emoji} />
      <View style={styles.flex}>
        <FigmaText tx={nameTx} text={name} variant="label" />
        <View style={styles.priceRow}>
          {oldPrice ? <FigmaText text={oldPrice} variant="caption" color="textSubtle" /> : null}
          {price ? <FigmaText text={price} variant="caption" color="brand" /> : null}
        </View>
        {additions ? <FigmaDivider style={styles.itemDivider} /> : null}
      </View>
    </FigmaCard>
  );
}

export function InfoCard({
  icon,
  title,
  titleTx,
  subtitle,
  subtitleTx,
}: {
  icon: string;
  title?: string;
  titleTx?: string;
  subtitle?: string;
  subtitleTx?: string;
}) {
  const { figmaColors } = useFigmaTokens();
  return (
    <FigmaCard style={styles.infoCard}>
      <Icon name={icon} size={18} color={figmaColors.brand} />
      <View style={styles.flex}>
        <FigmaText tx={titleTx} text={title} />
        <FigmaText tx={subtitleTx} text={subtitle} variant="bodyStrong" numberOfLines={1} />
      </View>
      <View style={mirrorStyle(true)}>
        <Icon name="chevron-right" size={24} color={figmaColors.icon} />
      </View>
    </FigmaCard>
  );
}

export function OrderCard({ status, statusTx }: { status?: string; statusTx?: string }) {
  return (
    <FigmaCard style={styles.orderCard}>
      <View style={styles.flex}>
        <FigmaText tx="orders.order" variant="tiny" />
        <FigmaText text={status} tx={statusTx} variant="caption" color="brand" />
      </View>
    </FigmaCard>
  );
}

export function FilterPills({
  filters = [],
  active,
}: {
  filters?: Array<{ key: string; label?: string; labelTx?: string }>;
  active?: string;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPills}>
      {filters.map((filter) => (
        <FigmaChip
          key={filter.key}
          text={filter.label}
          tx={filter.labelTx}
          selected={active === filter.key || active === filter.label}
        />
      ))}
    </ScrollView>
  );
}

export function AuthBottom({ mode }: { mode: 'login' | 'register' }) {
  return (
    <View style={styles.authBottom}>
      <FigmaDivider />
      <FigmaText tx={mode === 'login' ? 'auth.noAccount' : 'auth.haveAccount'} align="center" />
    </View>
  );
}

export function FigmaTabBarFromRoutes({
  routes,
  active,
  onPress,
}: {
  routes: Array<{ key: string; label?: string; labelTx?: string; icon: string }>;
  active: string;
  onPress: (key: string) => void;
}) {
  return (
    <FigmaTabBar
      activeKey={active}
      onTabPress={onPress}
      tabs={routes.map((route) => ({
        key: route.key,
        text: route.label,
        tx: route.labelTx,
        icon: route.icon,
      }))}
    />
  );
}

const styles = StyleSheet.create({
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  screen: {
    flex: 1,
  },
  screenFill: {
    flex: 1,
  },
  screenContent: {
    paddingStart: spacing.screen,
    paddingEnd: spacing.screen,
    paddingTop: spacing.lg,
  },
  footer: {
    position: 'absolute',
    start: spacing.base,
    end: spacing.base,
    bottom: 0,
    paddingStart: spacing.base,
    paddingEnd: spacing.base,
    paddingTop: spacing.md,
  },
  surface: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  card: {
    paddingStart: spacing.base,
    paddingEnd: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.base,
  },
  section: {
    marginTop: spacing.section,
  },
  sectionHeader: {
    minHeight: spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.base,
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingStart: spacing.lg,
    paddingEnd: spacing.lg,
  },
  button_sm: {
    minHeight: spacing.xxl,
  },
  button_md: {
    minHeight: spacing.xxl + spacing.sm,
  },
  button_lg: {
    minHeight: spacing.xxl * 2,
  },
  inputWrap: {
    minHeight: spacing.xxl + spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingStart: spacing.base,
    paddingEnd: spacing.base,
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    writingDirection: 'auto',
  },
  inputError: {
    marginTop: spacing.xs,
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  otpCell: {
    width: spacing.xxl + spacing.base,
    height: spacing.xxl + spacing.base,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingStart: spacing.screen,
    paddingEnd: spacing.screen,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    width: spacing.xxl,
    height: spacing.xxs,
    borderRadius: radius.pill,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    paddingStart: spacing.base,
    paddingEnd: spacing.base,
    paddingBottom: spacing.md,
  },
  headerFloating: {
    marginStart: spacing.base,
    marginEnd: spacing.base,
    marginTop: spacing.sm,
    borderRadius: radius.floating,
  },
  headerRow: {
    minHeight: spacing.xxl + spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerSlot: {
    width: spacing.xxl + spacing.md,
    minHeight: spacing.xxl + spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabWrap: {
    position: 'absolute',
    start: spacing.base,
    end: spacing.base,
    bottom: 0,
  },
  tabBar: {
    minHeight: spacing.xxl * 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: spacing.tabInset,
    paddingEnd: spacing.tabInset,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabIcon: {
    width: spacing.xxl + spacing.base,
    height: spacing.xxl + spacing.base,
    borderRadius: radius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingStart: spacing.sm,
    paddingEnd: spacing.sm,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.xxs,
  },
  chip: {
    minHeight: spacing.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingStart: spacing.md,
    paddingEnd: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  iconButton: {
    width: spacing.xxl + spacing.md,
    height: spacing.xxl + spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCTA: {
    position: 'absolute',
    start: spacing.base,
    end: spacing.base,
    bottom: 0,
  },
  searchCompact: {
    minHeight: spacing.xxl + spacing.xs,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  checkBox: {
    width: spacing.xl,
    height: spacing.xl,
    borderWidth: spacing.xxs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.base,
  },
  summaryRowCompact: {
    marginBottom: spacing.sm,
  },
  settingsRow: {
    minHeight: spacing.xxl + spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  productImage: {
    width: spacing.xxl * 2 + spacing.sm,
    height: spacing.xxl * 2 + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productImageLarge: {
    width: '100%',
    height: spacing.xxl * 5 + spacing.lg,
  },
  productEmoji: {
    fontSize: spacing.xxl,
  },
  productEmojiLarge: {
    fontSize: spacing.xxl * 3,
  },
  categoryTile: {
    width: spacing.xxl * 2 + spacing.md,
    minHeight: spacing.xxl * 2 + spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  categoryEmoji: {
    fontSize: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.xl,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.lg,
  },
  productCard: {
    width: '46%',
    minHeight: spacing.xxl * 4,
    gap: spacing.xs,
  },
  favoriteDot: {
    position: 'absolute',
    end: spacing.sm,
    top: spacing.sm,
    width: spacing.lg,
    height: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  banner: {
    minHeight: spacing.xxl * 3 + spacing.md,
    paddingStart: spacing.xl,
    paddingEnd: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    overflow: 'hidden',
  },
  bannerEmoji: {
    fontSize: spacing.xxl * 2,
  },
  basketItem: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  itemDivider: {
    marginTop: spacing.sm,
  },
  infoCard: {
    minHeight: spacing.xxl * 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  orderCard: {
    minHeight: spacing.xxl * 2,
    marginBottom: spacing.base,
  },
  filterPills: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  authBottom: {
    gap: spacing.xl,
  },
});
