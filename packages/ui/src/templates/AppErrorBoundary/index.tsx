import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AppErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            The app hit an unexpected error. Details are below so it can be fixed.
          </Text>
          <ScrollView style={styles.detailsBox} contentContainerStyle={styles.detailsContent}>
            <Text style={styles.detailsTitle}>Error details</Text>
            <Text selectable style={styles.meta}>
              {this.state.error?.name ? `${this.state.error.name}: ` : ''}
              {this.state.error?.message ?? 'Unknown error'}
            </Text>
            {this.state.error?.stack ? (
              <Text selectable style={styles.stack}>
                {this.state.error.stack}
              </Text>
            ) : null}
          </ScrollView>
          <Pressable style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB'
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFECE8',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18
  },
  iconText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FF6048',
    lineHeight: 46
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18
  },
  detailsBox: {
    maxHeight: 260,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 18
  },
  detailsContent: {
    padding: 14
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 8
  },
  meta: {
    fontSize: 14,
    color: '#EF4444',
    lineHeight: 20,
    marginBottom: 10
  },
  stack: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18
  },
  button: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF6048',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  }
});
