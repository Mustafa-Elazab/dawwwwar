import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme, space, radius } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { api } from '../../../../core/api/client';
import type { Category } from '@dawwar/types';

interface CategoryPickerProps {
  selectedParentId: string;
  selectedChildIds: string[];
  onParentSelect: (id: string) => void;
  onChildToggle: (id: string) => void;
}

export const CategoryPicker = React.memo<CategoryPickerProps>(({
  selectedParentId,
  selectedChildIds,
  onParentSelect,
  onChildToggle,
}) => {
  const { colors } = useTheme();

  // ── Fetch all parents ─────────────────────────────────────────────────────
  const { data: parents = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories', 'parents'],
    // Use the main api client, but point to public endpoints. 
    // Assuming backend will accept even with token, but doesn't require it.
    queryFn: () => api.get<Category[]>('/categories/parents').then(r => r.data),
    staleTime: 30 * 60 * 1000,
  });

  // ── Fetch children of selected parent ─────────────────────────────────────
  const { data: children = [] } = useQuery<Category[]>({
    queryKey: ['categories', 'children', selectedParentId],
    queryFn: () =>
      api
        .get<Category[]>(`/categories/${selectedParentId}/children`)
        .then(r => r.data),
    enabled: !!selectedParentId, // ← only runs when parent is selected
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View>
      {/* ── Step 1: Parent Category ── */}
      <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>نوع المتجر *</Text>
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
              onPress={() => onParentSelect(parent.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{parent.icon}</Text>
              <Text style={[styles.chipLabel, { color: colors.textSecondary }, isSelected && { color: colors.primary, fontWeight: '700' }]}>
                {parent.nameAr}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Step 2: Children — only shown after parent selected ── */}
      {selectedParentId && children.length > 0 && (
        <View style={styles.childrenSection}>
          <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>التخصص (اختياري — يمكن اختيار أكثر من واحد)</Text>
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
                  onPress={() => onChildToggle(child.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipIcon}>{child.icon}</Text>
                  <Text style={[styles.chipLabel, { color: colors.textSecondary }, isSelected && { color: colors.primary, fontWeight: '700' }]}>
                    {child.nameAr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  loading: { paddingVertical: space.xl, alignItems: 'center' },
  stepLabel: { fontSize: 13, fontWeight: '600', marginBottom: space.sm, marginTop: space.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  parentChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: space.md, paddingVertical: space.sm,
    borderRadius: radius.xl, borderWidth: 1.5,
  },
  childChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: radius.lg, borderWidth: 1.5,
  },
  chipIcon: { fontSize: 18 },
  chipLabel: { fontSize: 13, fontWeight: '500' },
  childrenSection: { marginTop: space.lg },
});
