import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlaceholderScreenProps {
  screenName: string;
  taskId: number;
}

export function createPlaceholder(screenName: string, taskId: number) {
  return function PlaceholderScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{screenName}</Text>
        <Text style={styles.subtitle}>Built in Task {taskId}</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
