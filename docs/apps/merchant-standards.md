# Merchant App — Complete Fix & Standards Guide

> Covers: Reactotron setup · Profile completion gate · Tab icons · Full localization · Memoization rules · TypeScript strict rules — all mirroring the customer app quality bar.

---

## Table of Contents

1. [Reactotron Setup & Fix](#1-reactotron-setup--fix)
2. [Profile Completion Gate — Navigation Logic](#2-profile-completion-gate--navigation-logic)
3. [Tab Icons — Why They Disappear & How to Fix](#3-tab-icons--why-they-disappear--how-to-fix)
4. [Localization — Full System](#4-localization--full-system)
5. [Memoization Rules](#5-memoization-rules)
6. [TypeScript Strict Rules](#6-typescript-strict-rules)
7. [Apply Everything — Screen-by-Screen Checklist](#7-apply-everything--screen-by-screen-checklist)

---

# 1. Reactotron Setup & Fix

## Why It's Not Working

Reactotron fails in merchant app for one or more of these reasons:

1. The config file is missing or not imported before the app boots
2. `reactotron-redux` plugin is not connected to the Redux store
3. The `console.tron` type is not declared — TypeScript error silently kills it
4. On Android: the Metro port or IP is wrong for the emulator
5. The config file imports are in the wrong order in `index.js`

## The Fix — Step by Step

### Step 1 — Install packages (if not already)

```bash
# from apps/merchant root
pnpm add reactotron-react-native reactotron-redux reactotron-react-query
```

### Step 2 — Create the Reactotron config file

```typescript
// apps/merchant/src/config/reactotron.config.ts

import Reactotron, { networking } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Only run in development — NEVER in production
if (__DEV__) {
  Reactotron
    .configure({
      name: 'Dawwar Merchant',
      // Android emulator: use 10.0.2.2 instead of localhost
      host: 'localhost',
    })
    .useReactNative({
      asyncStorage: false, // we use MMKV, not AsyncStorage
      networking: {
        // ignore these noisy endpoints
        ignoreUrls: /\/logs$|\/sockjs-node|hot-update/,
      },
      editor: false,
      errors: { veto: () => false },
      overlay: false,
    })
    .use(reactotronRedux())
    .use(networking())
    .connect();

  // Clear timeline on every reload
  Reactotron.clear?.();

  // Override console so logs appear in Reactotron timeline
  console.tron = Reactotron;
}

export default Reactotron;
```

### Step 3 — Declare the type so TypeScript doesn't break

```typescript
// apps/merchant/src/types/reactotron.d.ts

import Reactotron from 'reactotron-react-native';

declare global {
  interface Console {
    tron: typeof Reactotron;
  }
}
```

### Step 4 — Import FIRST in index.js — before everything else

```typescript
// apps/merchant/index.js  ← this is the entry point

// ✅ MUST be the very first import — before React, before App
if (__DEV__) {
  require('./src/config/reactotron.config');
}

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### Step 5 — Connect to Redux store

```typescript
// apps/merchant/src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import Reactotron from '../config/reactotron.config';
import authReducer from './auth/authSlice';
import uiReducer from './ui/uiSlice';

const enhancers = __DEV__ && Reactotron.createEnhancer
  ? [Reactotron.createEnhancer()]
  : [];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(...enhancers),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Step 6 — Android Emulator specific fix

Android emulators cannot reach `localhost` — they need the host machine's IP as seen from the emulator.

```typescript
// apps/merchant/src/config/reactotron.config.ts

import { Platform } from 'react-native';

Reactotron.configure({
  name: 'Dawwar Merchant',
  host: Platform.OS === 'android' ? '10.0.2.2' : 'localhost',
  port: 9090,
})
```

Also run this in terminal before starting Metro:

```bash
# Android — forward the port from device to host machine
adb reverse tcp:9090 tcp:9090
```

### Step 7 — Verify it works

Open Reactotron desktop app → you should see:
```
✓ Connected: Dawwar Merchant
  State: { auth: {...}, ui: {...} }
```

If you see "No connections" — check:
- Is Reactotron desktop app open before you launch the app?
- Did you run `adb reverse`?
- Is the import in `index.js` the very first line?

---

# 2. Profile Completion Gate — Navigation Logic

## The Rule (Same as Customer App)

The customer app routes like this after splash:

```
Has token? → GET /auth/me
  → isApproved: false → PendingApproval
  → profile NOT complete → CompleteProfile
  → profile complete + no store → CreateStore   ← merchant only
  → profile complete + has store → MerchantTabs
No token? → PhoneScreen
```

## What "Profile Complete" Means for a Merchant

A merchant profile is considered **complete** when ALL of these are true:

| Field | Check |
|---|---|
| `user.name` | not null, not empty string |
| `user.phone` | always set (from OTP) |
| `user.isApproved` | true (set by admin) |
| `merchantProfile` | exists (returned by `GET /merchants/my`) |
| `merchantProfile.businessName` | not null |
| `merchantProfile.latitude` | not null |
| `merchantProfile.longitude` | not null |

## The Complete Splash Screen Implementation

```typescript
// apps/merchant/src/screens/SplashScreen.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../store/hooks';
import { restoreSession } from '../store/auth/authThunks';
import { apiClient } from 'packages/api-client';
import type { MerchantRootStackParamList } from '../navigation/types';
import { logger } from '../utils/logger';

type NavProp = NativeStackNavigationProp<MerchantRootStackParamList>;

// ─── helper — pure function, not a hook ──────────────────────────────────────
const isMerchantProfileComplete = (user: any): boolean => {
  return (
    typeof user?.name === 'string' &&
    user.name.trim().length > 0
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const SplashScreen = () => {
  // ✅ ALL hooks at top level
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Step 1 — restore JWT from MMKV
        const sessionResult = await dispatch(restoreSession());

        if (!restoreSession.fulfilled.match(sessionResult)) {
          // No token or expired
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          return;
        }

        const user = sessionResult.payload;

        // Step 2 — must be a merchant
        if (user.role !== 'MERCHANT') {
          logger.warn('SplashScreen: non-merchant token found, clearing');
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          return;
        }

        // Step 3 — profile name completion check
        if (!isMerchantProfileComplete(user)) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'CompleteProfile' }],
          });
          return;
        }

        // Step 4 — approval check
        if (!user.isApproved) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'PendingApproval' }],
          });
          return;
        }

        // Step 5 — store existence check
        try {
          const response = await apiClient.get('/merchants/my');
          const merchant = response.data;

          const hasStore =
            merchant &&
            typeof merchant.businessName === 'string' &&
            merchant.businessName.trim().length > 0 &&
            merchant.latitude != null &&
            merchant.longitude != null;

          if (!hasStore) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'CreateStore' }],
            });
            return;
          }

          // All good — go to main tabs
          navigation.reset({
            index: 0,
            routes: [{ name: 'MerchantTabs' }],
          });
        } catch (storeError: any) {
          if (storeError?.response?.status === 404) {
            // No store yet — first-time merchant
            navigation.reset({
              index: 0,
              routes: [{ name: 'CreateStore' }],
            });
          } else {
            // Network error — go home anyway, let screens handle auth errors
            logger.error('SplashScreen: store fetch failed', storeError);
            navigation.reset({
              index: 0,
              routes: [{ name: 'MerchantTabs' }],
            });
          }
        }
      } catch (error) {
        logger.error('SplashScreen: bootstrap failed', error);
        navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
      }
    };

    bootstrap();
  }, []); // ✅ empty deps — runs once on mount

  // ✅ Conditional return AFTER all hooks
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 180,
    height: 80,
  },
});

export default SplashScreen;
```

## Navigation Types File

```typescript
// apps/merchant/src/navigation/types.ts

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

// ─── Root Stack ───────────────────────────────────────────────────────────────
export type MerchantRootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  CompleteProfile: undefined;
  PendingApproval: undefined;
  CreateStore: undefined;
  MerchantTabs: undefined;
  // Screens accessible from tabs but pushed on root stack
  AddProduct: undefined;
  EditProduct: { productId: string };
  OrderDetail: { orderId: string };
  WalletScreen: undefined;
  TransactionsScreen: undefined;
};

// ─── Tab Navigator ────────────────────────────────────────────────────────────
export type MerchantTabParamList = {
  OrdersTab: undefined;
  MenuTab: undefined;
  StoreTab: undefined;
  ProfileTab: undefined;
};

// ─── Typed hooks ─────────────────────────────────────────────────────────────
export type MerchantRootNavProp =
  NativeStackNavigationProp<MerchantRootStackParamList>;

export type MerchantTabNavProp =
  BottomTabNavigationProp<MerchantTabParamList>;

// Usage in screens:
// const navigation = useNavigation<MerchantRootNavProp>();
// const route = useRoute<RouteProp<MerchantRootStackParamList, 'EditProduct'>>();
```

## Complete Profile Screen

```typescript
// apps/merchant/src/screens/CompleteProfileScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { completeProfile } from '../store/auth/authThunks';
import { useTranslation } from 'packages/i18n';
import type { MerchantRootNavProp } from '../navigation/types';

const CompleteProfileScreen = () => {
  // ✅ ALL hooks at top level
  const { t } = useTranslation();
  const navigation = useNavigation<MerchantRootNavProp>();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError(t('completeProfile.nameError'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await dispatch(completeProfile({ name: trimmed }));

      if (completeProfile.fulfilled.match(result)) {
        // After completing profile, check approval + store
        navigation.reset({
          index: 0,
          routes: [{ name: 'Splash' }], // re-run splash logic
        });
      } else {
        setError(t('common.errorTryAgain'));
      }
    } catch {
      setError(t('common.errorTryAgain'));
    } finally {
      setIsLoading(false);
    }
  }, [name, dispatch, navigation, t]);

  // ✅ Early return AFTER all hooks
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>{t('completeProfile.title')}</Text>
      <Text style={styles.subtitle}>{t('completeProfile.subtitle')}</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t('completeProfile.namePlaceholder')}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? t('common.loading') : t('completeProfile.submit')}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 32, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  errorText: { color: '#E53935', fontSize: 13, marginBottom: 12 },
  button: {
    backgroundColor: '#1A73E8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default CompleteProfileScreen;
```

---

# 3. Tab Icons — Why They Disappear & How to Fix

## Root Causes

Tab icons disappear due to one of these:

| Cause | Symptom |
|---|---|
| Icon library not linked | All icons blank, no error |
| Wrong icon name | That specific icon is blank |
| `tabBarIcon` function not returning anything | Tab is blank |
| Missing `focused` prop usage | Icon renders but looks wrong |
| Vector icons font not loaded | Crash or empty squares |
| Icon size 0 or color transparent | Invisible but technically rendered |

## The Fix — Complete Tab Navigator with Icons

```typescript
// apps/merchant/src/navigation/MerchantTabs.tsx

import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'packages/i18n';
import { useTheme } from 'packages/theme';

// ✅ Use one icon library consistently — pick ONE and stick to it
// Option A: @react-native-vector-icons (most common)
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Option B: If using expo vector icons:
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import IncomingOrdersScreen from '../screens/orders/IncomingOrdersScreen';
import ProductListScreen from '../screens/menu/ProductListScreen';
import StoreSettingsScreen from '../screens/store/StoreSettingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import type { MerchantTabParamList } from './types';

const Tab = createBottomTabNavigator<MerchantTabParamList>();

// ─── Icon components — memoized, defined OUTSIDE the navigator ────────────────
// IMPORTANT: define these outside the component.
// Defining them inside causes them to be recreated on every render
// which is what makes icons "disappear" (React remounts the component)

const OrdersIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="clipboard-list-outline" color={color} size={size} />
);

const MenuIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="food-fork-drink" color={color} size={size} />
);

const StoreIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="store-outline" color={color} size={size} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="account-circle-outline" color={color} size={size} />
);

// ─────────────────────────────────────────────────────────────────────────────

const MerchantTabs = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // ✅ screenOptions defined once with useCallback
  const screenOptions = useCallback(
    ({ route }: { route: { name: keyof MerchantTabParamList } }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500' as const,
      },
      // ✅ Map route name to icon component
      tabBarIcon: ({ color, size, focused }: {
        color: string;
        size: number;
        focused: boolean;
      }) => {
        const iconSize = focused ? size + 2 : size; // slight grow on active

        switch (route.name) {
          case 'OrdersTab':
            return <OrdersIcon color={color} size={iconSize} />;
          case 'MenuTab':
            return <MenuIcon color={color} size={iconSize} />;
          case 'StoreTab':
            return <StoreIcon color={color} size={iconSize} />;
          case 'ProfileTab':
            return <ProfileIcon color={color} size={iconSize} />;
          default:
            return null;
        }
      },
    }),
    [colors]
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="OrdersTab"
        component={IncomingOrdersScreen}
        options={{ tabBarLabel: t('tabs.orders') }}
      />
      <Tab.Screen
        name="MenuTab"
        component={ProductListScreen}
        options={{ tabBarLabel: t('tabs.menu') }}
      />
      <Tab.Screen
        name="StoreTab"
        component={StoreSettingsScreen}
        options={{ tabBarLabel: t('tabs.store') }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: t('tabs.profile') }}
      />
    </Tab.Navigator>
  );
};

export default MerchantTabs;
```

## Fix Vector Icons Font Not Loading (Android)

```gradle
// android/app/build.gradle — add this line inside android { ... }

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

```xml
<!-- android/app/src/main/res/values/styles.xml — make sure this exists -->
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    </style>
</resources>
```

## Fix Vector Icons on iOS

```bash
cd ios && pod install
```

Then in Xcode: make sure the font files are listed under **Build Phases → Copy Bundle Resources**.

## Checklist — Icons Not Appearing

- [ ] `react-native-vector-icons` is in `package.json` of the merchant app
- [ ] `fonts.gradle` is applied in `android/app/build.gradle`
- [ ] `pod install` was run after adding the package
- [ ] Icon names are correct — test at [oblador.github.io/react-native-vector-icons](https://oblador.github.io/react-native-vector-icons/)
- [ ] Icon components are defined **outside** the navigator component
- [ ] `tabBarIcon` returns JSX, not undefined
- [ ] `tabBarActiveTintColor` and `tabBarInactiveTintColor` are set (not transparent)
- [ ] Clean build after any native changes: `cd android && ./gradlew clean`

---

# 4. Localization — Full System

## Architecture (From `packages/i18n`)

The localization system already exists in the monorepo. The merchant app must consume it exactly the same way the customer app does.

```
packages/i18n/
├── ar.json          ← Arabic strings (RTL, default)
├── en.json          ← English strings (LTR)
├── index.ts         ← exports useTranslation, I18nProvider, changeLanguage
└── rtl.ts           ← RTL/LTR switching logic
```

## The Rules (Same as Customer App)

| Rule | Correct | Wrong |
|---|---|---|
| All user-facing strings in JSON files | `t('orders.accept')` | `"Accept"` hardcoded |
| Layout direction | `marginStart`, `paddingEnd` | `marginLeft`, `paddingRight` |
| Flex direction | `flexDirection: 'row'` (I18n controls start/end) | Never hardcode `row-reverse` |
| Text alignment | `textAlign: 'auto'` or `I18nManager.isRTL ? 'right' : 'left'` | Never hardcode `'right'` |
| Icon direction | Mirror icons with `scaleX: I18nManager.isRTL ? -1 : 1` | Never hardcode direction |
| Numbers | Use Arabic-Indic numerals for Arabic: `toLocaleString('ar-EG')` | Never display `٣` when user wants `3` |

## Translation Keys — Merchant App (Full List)

Add these to both `ar.json` and `en.json` in `packages/i18n`:

```json
// ar.json additions
{
  "merchant": {
    "splash": {
      "loading": "جاري التحميل..."
    },
    "auth": {
      "phone": {
        "title": "أدخل رقم هاتفك",
        "subtitle": "سنرسل لك رمز التحقق",
        "placeholder": "رقم الهاتف",
        "continue": "متابعة",
        "invalidPhone": "رقم الهاتف غير صالح"
      },
      "otp": {
        "title": "رمز التحقق",
        "subtitle": "أدخل الرمز المرسل إلى {{phone}}",
        "resend": "إعادة الإرسال",
        "resendIn": "إعادة الإرسال بعد {{seconds}}ث",
        "invalidOtp": "رمز التحقق غير صحيح"
      }
    },
    "completeProfile": {
      "title": "أكمل بياناتك",
      "subtitle": "نحتاج اسمك لإنشاء حسابك",
      "namePlaceholder": "الاسم بالكامل",
      "nameError": "يجب إدخال الاسم (حرفان على الأقل)",
      "submit": "حفظ ومتابعة"
    },
    "pendingApproval": {
      "title": "قيد المراجعة",
      "subtitle": "حسابك قيد المراجعة من قِبَل الإدارة. سنخطرك عند الموافقة.",
      "contactSupport": "تواصل مع الدعم"
    },
    "createStore": {
      "title": "أنشئ متجرك",
      "step1": "بيانات المتجر",
      "step2": "الموقع",
      "step3": "تأكيد",
      "businessName": "اسم المتجر",
      "businessNamePlaceholder": "مثال: مطعم الشيف أحمد",
      "businessNameError": "اسم المتجر مطلوب",
      "category": "نوع المتجر",
      "categoryPlaceholder": "اختر النوع",
      "location": "موقع المتجر",
      "locationSubtitle": "ضع الدبوس على موقع متجرك بدقة",
      "useGps": "استخدام موقعي الحالي",
      "confirm": "تأكيد",
      "submit": "إنشاء المتجر",
      "success": "تم إنشاء المتجر بنجاح!"
    },
    "tabs": {
      "orders": "الطلبات",
      "menu": "القائمة",
      "store": "المتجر",
      "profile": "الملف"
    },
    "orders": {
      "incoming": {
        "title": "الطلبات الواردة",
        "empty": "لا توجد طلبات واردة",
        "emptySubtitle": "ستظهر الطلبات الجديدة هنا فور استلامها",
        "accept": "قبول",
        "reject": "رفض",
        "prepTime": "وقت التحضير",
        "prepTimeMinutes": "{{minutes}} دقيقة",
        "confirmAccept": "تأكيد القبول",
        "rejectReason": "سبب الرفض (اختياري)",
        "confirmReject": "تأكيد الرفض",
        "ago": "منذ {{time}}",
        "items": "{{count}} عنصر",
        "paymentCash": "نقدي 💵",
        "paymentWallet": "محفظة 💳",
        "paymentOnline": "أونلاين 💳"
      },
      "active": {
        "title": "الطلبات النشطة",
        "empty": "لا توجد طلبات نشطة",
        "markReady": "الطلب جاهز ✓",
        "waitingDriver": "في انتظار السائق...",
        "driverAssigned": "السائق في الطريق",
        "driverPickedUp": "السائق أخذ الطلب",
        "delivered": "تم التسليم"
      },
      "status": {
        "PENDING": "في الانتظار",
        "ACCEPTED": "مقبول",
        "READY": "جاهز",
        "ASSIGNED": "تم تعيين سائق",
        "PICKED_UP": "في الطريق",
        "DELIVERED": "تم التوصيل",
        "COMPLETED": "مكتمل",
        "CANCELLED": "ملغي",
        "REJECTED": "مرفوض"
      },
      "history": {
        "title": "سجل الطلبات",
        "empty": "لا توجد طلبات سابقة"
      }
    },
    "menu": {
      "title": "قائمة المنتجات",
      "empty": "لا توجد منتجات بعد",
      "emptySubtitle": "أضف منتجك الأول لتبدأ البيع",
      "addProduct": "إضافة منتج",
      "editProduct": "تعديل المنتج",
      "productName": "اسم المنتج",
      "productNamePlaceholder": "مثال: برجر كلاسيك",
      "productNameError": "اسم المنتج مطلوب",
      "description": "الوصف",
      "descriptionPlaceholder": "وصف المنتج (اختياري)",
      "price": "السعر (ج.م)",
      "pricePlaceholder": "0.00",
      "priceError": "يجب إدخال سعر صحيح",
      "category": "التصنيف",
      "categoryPlaceholder": "مثال: الوجبات الرئيسية",
      "addImage": "إضافة صورة",
      "changeImage": "تغيير الصورة",
      "available": "متاح للطلب",
      "unavailable": "غير متاح",
      "save": "حفظ",
      "deleteProduct": "حذف المنتج",
      "deleteConfirm": "هل أنت متأكد من حذف هذا المنتج؟",
      "deleteCancel": "إلغاء",
      "deleteConfirmButton": "حذف",
      "savedSuccess": "تم الحفظ بنجاح"
    },
    "store": {
      "title": "إعدادات المتجر",
      "isOpen": "المتجر مفتوح",
      "isClosed": "المتجر مغلق",
      "openToggleHint": "اضغط لتغيير حالة المتجر",
      "businessName": "اسم المتجر",
      "location": "الموقع",
      "updateLocation": "تحديث الموقع",
      "saveChanges": "حفظ التغييرات",
      "savedSuccess": "تم حفظ التغييرات"
    },
    "profile": {
      "title": "الملف الشخصي",
      "name": "الاسم",
      "phone": "رقم الهاتف",
      "wallet": "المحفظة",
      "transactions": "سجل المعاملات",
      "logout": "تسجيل الخروج",
      "logoutConfirm": "هل تريد تسجيل الخروج؟"
    },
    "wallet": {
      "title": "المحفظة",
      "balance": "الرصيد المتاح",
      "pendingWithdrawal": "قيد السحب",
      "requestWithdrawal": "طلب سحب",
      "withdrawalAmount": "المبلغ المراد سحبه",
      "withdrawalSuccess": "تم إرسال طلب السحب بنجاح"
    },
    "transactions": {
      "title": "سجل المعاملات",
      "empty": "لا توجد معاملات بعد",
      "today": "اليوم",
      "yesterday": "أمس",
      "filterAll": "الكل",
      "filterCredit": "وارد",
      "filterDebit": "صادر",
      "reasons": {
        "ORDER_PAYMENT": "دفع طلب",
        "WALLET_RECHARGE": "شحن المحفظة",
        "DELIVERY_FEE": "رسوم توصيل",
        "TIP": "إكرامية",
        "WITHDRAWAL": "سحب",
        "COMMISSION_DEDUCTION": "عمولة المنصة"
      }
    },
    "common": {
      "loading": "جاري التحميل...",
      "errorTryAgain": "حدث خطأ، يرجى المحاولة مجدداً",
      "networkError": "تحقق من اتصالك بالإنترنت",
      "retry": "إعادة المحاولة",
      "cancel": "إلغاء",
      "confirm": "تأكيد",
      "save": "حفظ",
      "delete": "حذف",
      "edit": "تعديل",
      "back": "رجوع",
      "next": "التالي",
      "done": "تم",
      "currency": "ج.م",
      "egp": "{{amount}} ج.م"
    }
  }
}
```

```json
// en.json additions (mirror of above in English)
{
  "merchant": {
    "completeProfile": {
      "title": "Complete Your Profile",
      "subtitle": "We need your name to set up your account",
      "namePlaceholder": "Full name",
      "nameError": "Name must be at least 2 characters",
      "submit": "Save & Continue"
    },
    "tabs": {
      "orders": "Orders",
      "menu": "Menu",
      "store": "Store",
      "profile": "Profile"
    },
    "orders": {
      "incoming": {
        "title": "Incoming Orders",
        "empty": "No incoming orders",
        "emptySubtitle": "New orders will appear here",
        "accept": "Accept",
        "reject": "Reject",
        "prepTime": "Prep Time",
        "confirmAccept": "Confirm Acceptance",
        "confirmReject": "Confirm Rejection"
      },
      "status": {
        "PENDING": "Pending",
        "ACCEPTED": "Accepted",
        "READY": "Ready",
        "ASSIGNED": "Driver Assigned",
        "PICKED_UP": "Picked Up",
        "DELIVERED": "Delivered",
        "COMPLETED": "Completed",
        "CANCELLED": "Cancelled",
        "REJECTED": "Rejected"
      }
    }
  }
}
```

## RTL Layout Rules — Applied to Merchant Screens

```typescript
// ✅ CORRECT — logical properties (work in both RTL and LTR)
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,      // same both sides — always fine
  },
  row: {
    flexDirection: 'row',       // fine — start/end controlled by RTL
  },
  icon: {
    marginEnd: 8,               // ← right in LTR, left in RTL — CORRECT
  },
  label: {
    textAlign: 'auto',          // ← follows system direction — CORRECT
    marginStart: 12,            // ← left in LTR, right in RTL — CORRECT
  },
});

// ❌ WRONG — hardcoded direction
const wrongStyles = StyleSheet.create({
  icon: { marginRight: 8 },    // ← breaks in RTL
  label: { textAlign: 'right', marginLeft: 12 }, // ← breaks in LTR
});
```

### Arrow/Chevron Icons Must Mirror

```typescript
import { I18nManager } from 'react-native';

// Back arrow or forward arrow
const ChevronIcon = () => (
  <Icon
    name="chevron-right"
    style={{
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    }}
  />
);
```

### Currency Display

```typescript
// utils/formatCurrency.ts
export const formatCurrency = (amount: number, locale = 'ar-EG'): string => {
  return `${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${locale === 'ar-EG' ? 'ج.م' : 'EGP'}`;
};

// Usage: formatCurrency(127.50) → "١٢٧٫٥٠ ج.م"
```

---

# 5. Memoization Rules

These rules are **identical to the customer app**. Apply them consistently across every merchant screen and component.

## Rule 1 — Every List Item Component Gets `React.memo`

```typescript
// ✅ CORRECT
const OrderCard = ({ order, onAccept, onReject }: OrderCardProps) => {
  // component body
};
export default React.memo(OrderCard);

// Components that MUST be memoized in merchant app:
// - OrderCard (incoming)
// - OrderCard (active)
// - ProductCard
// - OrderItemRow
// - CategoryTab (horizontal scroll)
// - TransactionRow
// - EarningsSummaryCard
```

## Rule 2 — Every Handler Passed as Prop Gets `useCallback`

```typescript
// ✅ CORRECT
const IncomingOrdersScreen = () => {
  const acceptMutation = useAcceptOrder();
  const rejectMutation = useRejectOrder();

  // ✅ Wrapped in useCallback — stable reference, OrderCard won't re-render
  const handleAccept = useCallback((orderId: string) => {
    acceptMutation.mutate({ orderId });
  }, [acceptMutation]);

  const handleReject = useCallback((orderId: string, reason?: string) => {
    rejectMutation.mutate({ orderId, reason });
  }, [rejectMutation]);

  return (
    <FlatList
      renderItem={({ item }) => (
        <OrderCard
          order={item}
          onAccept={handleAccept}   // ← stable ref
          onReject={handleReject}   // ← stable ref
        />
      )}
    />
  );
};
```

## Rule 3 — Derived Data Gets `useMemo`

```typescript
// ✅ CORRECT
const IncomingOrdersScreen = () => {
  const { data: orders = [] } = useMerchantOrders('PENDING');

  // ✅ Computed once, not on every render
  const pendingCount = useMemo(
    () => orders.filter(o => o.status === 'PENDING').length,
    [orders]
  );

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [orders]
  );

  // ❌ WRONG — recalculated on every render
  // const pendingCount = orders.filter(o => o.status === 'PENDING').length;
};
```

## Rule 4 — StyleSheet Always at Module Scope

```typescript
// ✅ CORRECT — created once when module loads
const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { borderRadius: 12, padding: 16 },
});

const OrderCard = () => {
  return <View style={styles.card} />;
};

// ❌ WRONG — StyleSheet recreated on every render
const OrderCard = () => {
  const styles = StyleSheet.create({ // ← inside component
    card: { borderRadius: 12, padding: 16 },
  });
  return <View style={styles.card} />;
};
```

## Rule 5 — FlatList Performance Props

```typescript
// ✅ CORRECT — all performance props set
<FlatList
  data={orders}
  keyExtractor={useCallback((item: Order) => item.id, [])}
  renderItem={renderItem}                    // ← useCallback wrapped
  removeClippedSubviews={true}              // ← unmount off-screen items
  maxToRenderPerBatch={10}                  // ← batch rendering
  windowSize={5}                            // ← render window
  initialNumToRender={8}                    // ← initial render count
  getItemLayout={useCallback(              // ← skip measurement if fixed height
    (_: any, index: number) => ({
      length: ORDER_CARD_HEIGHT,
      offset: ORDER_CARD_HEIGHT * index,
      index,
    }),
    []
  )}
/>
```

## Rule 6 — Socket Handlers in useCallback + useEffect Cleanup

```typescript
// ✅ CORRECT
const IncomingOrdersScreen = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // ✅ Stable handler reference
  const handleNewOrder = useCallback(
    (payload: OrderStatusChangedPayload) => {
      if (payload.status === 'PENDING') {
        queryClient.invalidateQueries(['orders', 'merchant', 'PENDING']);
      }
    },
    [queryClient]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on('ORDER_STATUS_CHANGED', handleNewOrder);
    return () => {
      socket.off('ORDER_STATUS_CHANGED', handleNewOrder); // ✅ cleanup
    };
  }, [socket, handleNewOrder]);
};
```

---

# 6. TypeScript Strict Rules

These mirror the customer app's TypeScript standards from the audit report. Apply all of them.

## Rule 1 — No `as any` Anywhere

```typescript
// ❌ WRONG
const user = result.payload as any;
const merchant = response.data as any;

// ✅ CORRECT
import type { User, Merchant } from 'packages/types';
const user = result.payload as User;
const merchant = response.data as Merchant;
```

## Rule 2 — All Navigation Hooks Are Typed

```typescript
// ❌ WRONG — untyped
const navigation = useNavigation();
const route = useRoute();

// ✅ CORRECT — fully typed
import type { MerchantRootNavProp } from '../navigation/types';
import type { RouteProp } from '@react-navigation/native';
import type { MerchantRootStackParamList } from '../navigation/types';

const navigation = useNavigation<MerchantRootNavProp>();
const route = useRoute<RouteProp<MerchantRootStackParamList, 'EditProduct'>>();
const { productId } = route.params; // ✅ TypeScript knows this is a string
```

## Rule 3 — All Redux Selectors Are Typed

```typescript
// store/hooks.ts — typed hooks for merchant app
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage in screens — typed, no 'any'
const user = useAppSelector((state) => state.auth.user);
// TypeScript infers: user is User | null
```

## Rule 4 — All API Response Types Are Declared

```typescript
// ✅ CORRECT — typed API call
import type { Order, Product, Merchant } from 'packages/types';

// In api-client hooks:
const useMerchantOrders = (status: OrderStatus) =>
  useQuery<Order[]>({
    queryKey: ['orders', 'merchant', status],
    queryFn: () =>
      apiClient
        .get<Order[]>(`/orders/merchant?status=${status}`)
        .then((r) => r.data),
  });

// ❌ WRONG — no type annotation
const useMerchantOrders = (status: string) =>
  useQuery({
    queryFn: () => apiClient.get(`/orders/merchant`).then(r => r.data),
    // return type is 'any'
  });
```

## Rule 5 — Props Interfaces for Every Component

```typescript
// ✅ CORRECT — every component has typed props
interface OrderCardProps {
  order: Order;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string, reason?: string) => void;
  isLoading?: boolean;
}

const OrderCard = React.memo<OrderCardProps>(({
  order,
  onAccept,
  onReject,
  isLoading = false,
}) => {
  // TypeScript enforces all prop types at call sites
});
```

## Rule 6 — Enum Types From `packages/types` Only

```typescript
// ❌ WRONG — magic strings
if (order.status === 'PENDING') { ... }
if (order.paymentMethod === 'CASH') { ... }

// ✅ CORRECT — use enums from shared package
import { OrderStatus, PaymentMethod } from 'packages/types';

if (order.status === OrderStatus.PENDING) { ... }
if (order.paymentMethod === PaymentMethod.CASH) { ... }
```

## Rule 7 — Strict Null Checks on Optional Data

```typescript
// ❌ WRONG — crashes if merchant is null
const { businessName } = merchant;
const lat = merchant.latitude;

// ✅ CORRECT — optional chaining + fallback
const businessName = merchant?.businessName ?? '';
const lat = merchant?.latitude ?? 0;

// Or validate before use:
if (!merchant) return <LoadingScreen />;
// After this point TypeScript knows merchant is non-null
const { businessName, latitude } = merchant;
```

## Run TypeScript Check

```bash
# From monorepo root — checks ALL packages and apps
pnpm type-check

# From merchant app only
cd apps/merchant && pnpm tsc --noEmit

# Watch mode during development
pnpm tsc --noEmit --watch
```

**Goal: zero errors before any PR is merged.**

---

# 7. Apply Everything — Screen-by-Screen Checklist

Use this as your working checklist. Check each item off per screen.

## For Every Screen in the Merchant App

```
□ All hooks at top level — no conditional hooks
□ All early returns AFTER all hooks
□ useTranslation() used — no hardcoded Arabic or English strings
□ All layout uses marginStart/End, paddingStart/End (no Left/Right)
□ textAlign: 'auto' (not hardcoded 'right' or 'left')
□ Navigation typed with MerchantRootNavProp
□ Route params typed with RouteProp
□ No 'as any' in the file
□ StyleSheet.create at module scope (not inside component)
□ useCallback on all handlers passed as props
□ useMemo on derived/computed data
□ Pull-to-refresh wired if it's a list screen
□ Empty state shown if list is empty (with translated message)
□ Error state shown with retry button
□ Loading state shown while fetching
```

## Per-Screen Specifics

| Screen | Reactotron | Profile Gate | Icons | i18n | Memo | TS |
|---|---|---|---|---|---|---|
| SplashScreen | ✓ logs bootstrap | ✓ full gate logic | — | ✓ | — | ✓ |
| PhoneScreen | ✓ log OTP send | — | — | ✓ all strings | — | ✓ |
| OtpScreen | ✓ log verify | — | — | ✓ all strings | — | ✓ |
| CompleteProfileScreen | — | ✓ is the gate | — | ✓ all strings | useCallback | ✓ |
| PendingApprovalScreen | — | — | — | ✓ all strings | — | ✓ |
| CreateStoreScreen | ✓ log submit | — | — | ✓ all strings | useCallback | ✓ |
| MerchantTabs | — | — | ✓ icon fix | ✓ tab labels | icons outside | ✓ |
| IncomingOrdersScreen | ✓ log orders | — | ✓ status icons | ✓ all strings | ✓ memo+cb | ✓ |
| ActiveOrdersScreen | — | — | ✓ status icons | ✓ all strings | ✓ memo+cb | ✓ |
| ProductListScreen | — | — | ✓ FAB icon | ✓ all strings | ✓ memo+cb | ✓ |
| AddProductScreen | ✓ log submit | — | ✓ image icon | ✓ all strings | useCallback | ✓ |
| EditProductScreen | ✓ log submit | — | ✓ image icon | ✓ all strings | useCallback | ✓ |
| StoreSettingsScreen | — | — | ✓ toggle icon | ✓ all strings | useCallback | ✓ |
| ProfileScreen | — | — | ✓ nav icons | ✓ all strings | — | ✓ |
| WalletScreen | — | — | — | ✓ all strings | useMemo | ✓ |
| TransactionsScreen | — | — | — | ✓ all strings | ✓ hooks fix | ✓ |

## Final Verification Commands

```bash
# 1. TypeScript clean
pnpm type-check
# Expected: 0 errors

# 2. Check for hardcoded Arabic/English strings (should return nothing)
grep -r '"[أ-ي]' apps/merchant/src --include="*.tsx" --include="*.ts"
grep -rE '"(Accept|Reject|Save|Cancel|Loading)"' apps/merchant/src --include="*.tsx"

# 3. Check for forbidden layout properties (should return nothing)
grep -rE 'marginLeft|marginRight|paddingLeft|paddingRight' apps/merchant/src --include="*.tsx" --include="*.ts"

# 4. Check for 'as any' (should return nothing)
grep -r 'as any' apps/merchant/src --include="*.tsx" --include="*.ts"

# 5. Check for inline StyleSheet.create inside components
# Look for StyleSheet.create that appears after 'const ' + component name
# This is harder to grep — do a manual review of each screen file
```

---

## Summary — The 4 Non-Negotiables

Before shipping any merchant app screen, it must pass these 4 checks:

**1. Reactotron:** Config imported first in `index.js`. Redux enhancer connected. `adb reverse tcp:9090 tcp:9090` run for Android.

**2. Profile Gate:** Splash checks in this exact order: token → role === MERCHANT → name complete → isApproved → store exists. Each failure routes to the correct screen.

**3. Icons:** Icon components defined **outside** the Tab.Navigator component. Font linked in `build.gradle` and Xcode. Icon names verified.

**4. Everything localized:** Zero hardcoded Arabic or English strings. Zero `marginLeft`/`marginRight`. Zero `textAlign: 'right'`. Use `t()`, `marginStart`/`End`, `textAlign: 'auto'`.