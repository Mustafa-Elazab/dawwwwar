/**
 * Centralized error codes → localized messages.
 * Backend always returns an `errorCode` key. The mobile app should
 * map it to its own i18n. The `message` field is a fallback for debugging
 * and for clients that don't have the key yet.
 */

export type SupportedLang = 'en' | 'ar';

interface ErrorDef {
  en: string;
  ar: string;
}

export const ERROR_MESSAGES: Record<string, ErrorDef> = {
  // ── Auth ────────────────────────────────────────────────────────────
  INVALID_PHONE: {
    en: 'Please enter a valid Egyptian phone number.',
    ar: 'يرجى إدخال رقم هاتف مصري صحيح.',
  },
  OTP_LOCKED: {
    en: 'Too many failed attempts. Please request a new code.',
    ar: 'محاولات كثيرة فاشلة. يرجى طلب رمز جديد.',
  },
  INVALID_OTP: {
    en: 'Incorrect verification code.',
    ar: 'رمز التحقق غير صحيح.',
  },
  USER_NOT_FOUND: {
    en: 'User not found.',
    ar: 'المستخدم غير موجود.',
  },
  ACCESS_DENIED: {
    en: 'Access denied.',
    ar: 'تم رفض الوصول.',
  },
  INVALID_REFRESH_TOKEN: {
    en: 'Invalid or expired refresh token.',
    ar: 'رمز التحديث غير صالح أو منتهي الصلاحية.',
  },
  CANNOT_ASSIGN_ADMIN: {
    en: 'Cannot assign admin role.',
    ar: 'لا يمكن تعيين صلاحية المسؤول.',
  },
  ACCESS_TOKEN_REQUIRED: {
    en: 'Access token required.',
    ar: 'رمز الوصول مطلوب.',
  },
  ROLE_NOT_ALLOWED: {
    en: 'Your role does not have access to this resource.',
    ar: 'صلاحيتك لا تسمح بالوصول لهذا المورد.',
  },

  // ── Orders ──────────────────────────────────────────────────────────
  MERCHANT_NOT_ACCEPTING: {
    en: 'Merchant is not accepting orders right now.',
    ar: 'المحل لا يستقبل طلبات الآن.',
  },
  PRODUCT_NOT_FOUND: {
    en: 'Product not found for this merchant.',
    ar: 'المنتج غير موجود لدى هذا المحل.',
  },
  PRODUCT_UNAVAILABLE: {
    en: 'This product is currently unavailable.',
    ar: 'هذا المنتج غير متاح حالياً.',
  },
  ORDER_NOT_FOUND: {
    en: 'Order not found.',
    ar: 'الطلب غير موجود.',
  },
  ORDER_NOT_PENDING: {
    en: 'Order is not in pending status.',
    ar: 'الطلب ليس في حالة انتظار.',
  },
  ORDER_ALREADY_TAKEN: {
    en: 'This order has already been taken.',
    ar: 'تم أخذ هذا الطلب بالفعل.',
  },
  ORDER_NOT_READY_TO_MARK: {
    en: 'Order must be accepted or assigned to mark as ready.',
    ar: 'يجب قبول الطلب أو تعيينه لتحديده كجاهز.',
  },
  NOT_YOUR_ORDER: {
    en: 'This is not your order.',
    ar: 'هذا ليس طلبك.',
  },
  CAN_ONLY_CANCEL_PENDING: {
    en: 'Can only cancel orders in pending status.',
    ar: 'يمكن إلغاء الطلبات في حالة الانتظار فقط.',
  },
  CAN_ONLY_TIP_COMPLETED: {
    en: 'Can only tip completed orders.',
    ar: 'يمكن إضافة إكرامية للطلبات المكتملة فقط.',
  },
  INVALID_TIP_AMOUNT: {
    en: 'Invalid tip amount.',
    ar: 'مبلغ الإكرامية غير صالح.',
  },
  NOT_ASSIGNED_TO_ORDER: {
    en: 'You are not assigned to this order.',
    ar: 'أنت غير مسؤول عن هذا الطلب.',
  },
  CANNOT_MANAGE_ORDER: {
    en: 'You cannot manage this order.',
    ar: 'لا يمكنك إدارة هذا الطلب.',
  },

  // ── Wallet ──────────────────────────────────────────────────────────
  INSUFFICIENT_WALLET_BALANCE: {
    en: 'Insufficient wallet balance.',
    ar: 'رصيد المحفظة غير كافٍ.',
  },
  WALLET_NOT_FOUND: {
    en: 'Wallet not found.',
    ar: 'المحفظة غير موجودة.',
  },
  MIN_RECHARGE_AMOUNT: {
    en: 'Minimum recharge amount is 10 EGP.',
    ar: 'الحد الأدنى لإعادة الشحن 10 جنيه.',
  },
  PAYMENT_GATEWAY_ERROR: {
    en: 'Payment gateway error. Please try again.',
    ar: 'خطأ في بوابة الدفع. يرجى المحاولة مرة أخرى.',
  },

  // ── Merchant / Product ─────────────────────────────────────────────
  MERCHANT_NOT_FOUND: {
    en: 'Merchant not found.',
    ar: 'المحل غير موجود.',
  },
  NOT_A_MERCHANT: {
    en: 'You are not registered as a merchant.',
    ar: 'أنت غير مسجل كمحل.',
  },
  CANNOT_UPDATE_PRODUCT: {
    en: 'You cannot update this product.',
    ar: 'لا يمكنك تعديل هذا المنتج.',
  },
  CANNOT_DELETE_PRODUCT: {
    en: 'You cannot delete this product.',
    ar: 'لا يمكنك حذف هذا المنتج.',
  },

  // ── Driver ──────────────────────────────────────────────────────────
  DRIVER_PROFILE_NOT_FOUND: {
    en: 'Driver profile not found.',
    ar: 'ملف السائق غير موجود.',
  },

  // ── Address ─────────────────────────────────────────────────────────
  ADDRESS_NOT_FOUND: {
    en: 'Address not found.',
    ar: 'العنوان غير موجود.',
  },

  // ── Review ──────────────────────────────────────────────────────────
  CAN_ONLY_REVIEW_COMPLETED: {
    en: 'Can only review completed orders.',
    ar: 'يمكن تقييم الطلبات المكتملة فقط.',
  },
  ALREADY_REVIEWED: {
    en: 'You have already reviewed this order.',
    ar: 'لقد قمت بتقييم هذا الطلب بالفعل.',
  },

  // ── Promo ───────────────────────────────────────────────────────────
  INVALID_PROMO_CODE: {
    en: 'Invalid promo code.',
    ar: 'كود الخصم غير صالح.',
  },
  PROMO_EXPIRED: {
    en: 'This promo code has expired.',
    ar: 'كود الخصم منتهي الصلاحية.',
  },
  PROMO_EXHAUSTED: {
    en: 'This promo code has reached its usage limit.',
    ar: 'كود الخصم وصل لحد الاستخدام.',
  },
  PROMO_NOT_FOUND: {
    en: 'Promo code not found.',
    ar: 'كود الخصم غير موجود.',
  },

  // ── Favorites ───────────────────────────────────────────────────────
  ALREADY_IN_FAVORITES: {
    en: 'Already in favorites.',
    ar: 'موجود بالفعل في المفضلة.',
  },
  FAVORITE_NOT_FOUND: {
    en: 'Favorite not found.',
    ar: 'المفضلة غير موجودة.',
  },

  // ── Upload ──────────────────────────────────────────────────────────
  FILE_TYPE_NOT_ALLOWED: {
    en: 'File type not allowed.',
    ar: 'نوع الملف غير مسموح.',
  },

  // ── Chat ────────────────────────────────────────────────────────────
  CHAT_NOT_YOUR_ORDER: {
    en: 'You are not part of this order chat.',
    ar: 'أنت لست جزءاً من محادثة هذا الطلب.',
  },

  // ── Generic ─────────────────────────────────────────────────────────
  GENERIC_ERROR: {
    en: 'An error occurred. Please try again.',
    ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  },
};

/**
 * Resolve the `Accept-Language` header to 'en' or 'ar'.
 */
export function resolveLanguage(acceptLanguage?: string): SupportedLang {
  if (!acceptLanguage) return 'en';
  const first = acceptLanguage.split(',')[0]?.trim().toLowerCase() ?? '';
  if (first.startsWith('ar')) return 'ar';
  return 'en';
}

/**
 * Get a localized message for an error code.
 */
export function getLocalizedMessage(errorCode: string, lang: SupportedLang = 'en'): string {
  const def = ERROR_MESSAGES[errorCode];
  if (!def) return ERROR_MESSAGES['GENERIC_ERROR']?.[lang] ?? errorCode;
  return def[lang];
}
