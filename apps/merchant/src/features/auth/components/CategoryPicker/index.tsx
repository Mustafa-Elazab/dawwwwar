import React, { useState, useCallback } from 'react';
import {
  View, TouchableOpacity, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme, space, radius } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { api } from '../../../../core/api/client';
import type { Category } from '@dawwar/types';

interface CategoryPickerProps {
  // Called when selection changes — parentId always set, childIds optional
  onSelectionChange: (parentId: string, childIds: string[]) => void;
  initialParentId?: string;
  initialChildIds?: string[];
}

function isMaterialStyleIcon(icon: string) {
  return /^[a-z0-9-]+$/.test((icon || '').trim()) && (icon || '').trim().length >= 2;
}

export const CategoryPicker = React.memo<CategoryPickerProps>(({
  onSelectionChange,
  initialParentId = '',
  initialChildIds = [],
}) => {
  const { colors } = useTheme();

  // ✅ ALL hooks at top level
  const [selectedParentId, setSelectedParentId] = useState(initialParentId);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>(initialChildIds);

  // Fetch parents — always runs
  const {
    data: parents = [],
    isLoading: parentsLoading,
    isError: parentsError,
    refetch: refetchParents,
  } = useQuery<Category[]>({
    queryKey: ['categories', 'parents'],
    queryFn: () => api.get<Category[]>('/categories/parents').then(r => r.data),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Fetch children — only runs when a parent is selected
  const {
    data: children = [],
    isLoading: childrenLoading,
  } = useQuery<Category[]>({
    queryKey: ['categories', 'children', selectedParentId],
    queryFn: () => api.get<Category[]>(`/categories/${selectedParentId}/children`).then(r => r.data),
    enabled: selectedParentId.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const handleParentSelect = useCallback((id: string) => {
    setSelectedParentId(id);
    setSelectedChildIds([]);  // clear children when parent changes
    onSelectionChange(id, []);
  }, [onSelectionChange]);

  const handleChildToggle = useCallback((id: string) => {
    setSelectedChildIds(prev => {
      const next = prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id];
      onSelectionChange(selectedParentId, next);
      return next;
    });
  }, [selectedParentId, onSelectionChange]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View>

      {/* ── Parents ── */}
      <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>نوع المتجر *</Text>

      {parentsLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      )}

      {parentsError && (
        <TouchableOpacity style={styles.errorBox} onPress={() => refetchParents()}>
          <Text style={styles.errorText}>تعذّر تحميل الفئات</Text>
          <Text style={[styles.retryText, { color: colors.primary }]}>اضغط للمحاولة مجدداً</Text>
        </TouchableOpacity>
      )}

      {!parentsLoading && !parentsError && (
        <View style={styles.grid}>
          {parents.map((parent) => {
            const isSelected = selectedParentId === parent.id;
            return (
              <TouchableOpacity
                key={parent.id}
                style={[
                  styles.parentChip,
                  { borderColor: colors.border, backgroundColor: colors.background },
                  isSelected && { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
                ]}
                onPress={() => handleParentSelect(parent.id)}
                activeOpacity={0.7}
              >
                {isMaterialStyleIcon(parent.icon) ? (
                  <Icon
                    name={parent.icon as any}
                    size={20}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                ) : (
                  <Text style={styles.chipIcon}>{parent.icon || '📦'}</Text>
                )}
                <Text
                  style={[
                    styles.chipLabel,
                    { color: colors.textSecondary },
                    isSelected && { color: colors.primary, fontWeight: '700' },
                  ]}
                >
                  {parent.nameAr ?? parent.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ── Children — only shown after parent selected ── */}
      {selectedParentId.length > 0 && (
        <View style={styles.childSection}>
          <View style={styles.childHeader}>
            <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>التخصص</Text>
            <Text style={styles.optionalLabel}>(اختياري — اختر ما ينطبق)</Text>
          </View>

          {childrenLoading && (
            <ActivityIndicator color={colors.primary} size="small" style={{ marginTop: 8 }} />
          )}

          {!childrenLoading && children.length === 0 && (
            <Text style={styles.noChildrenText}>
              لا توجد تخصصات لهذا النوع
            </Text>
          )}

          {!childrenLoading && children.length > 0 && (
            <View style={styles.grid}>
              {children.map((child) => {
                const isSelected = selectedChildIds.includes(child.id);
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childChip,
                      { borderColor: colors.border, backgroundColor: colors.surfaceVariant },
                      isSelected && { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
                    ]}
                    onPress={() => handleChildToggle(child.id)}
                    activeOpacity={0.7}
                  >
                    {isMaterialStyleIcon(child.icon) ? (
                      <Icon
                        name={child.icon as any}
                        size={18}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                    ) : (
                      <Text style={styles.chipIcon}>{child.icon || '📦'}</Text>
                    )}
                    <Text
                      style={[
                        styles.chipLabel,
                        { color: colors.textSecondary },
                        isSelected && { color: colors.primary, fontWeight: '700' },
                      ]}
                    >
                      {child.nameAr ?? child.name}
                    </Text>
                    {isSelected && (
                      <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 4,
  },
  optionalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginStart: 6,
  },
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  parentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.xl,
    borderWidth: 1.5,
  },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  chipIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  chipLabel: {
    fontSize: 13,
  },
  checkmark: {
    fontSize: 11,
    fontWeight: '700',
    marginStart: 2,
  },
  centered: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: { fontSize: 13, color: '#9CA3AF' },
  errorBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: { fontSize: 13, color: '#EF4444', marginBottom: 4 },
  retryText: { fontSize: 13, fontWeight: '600' },
  childSection: { marginTop: 20 },
  noChildrenText: { fontSize: 13, color: '#9CA3AF', paddingVertical: 6 },
});
