import {StyleSheet, View} from 'react-native';
import React from 'react';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {Colors, FontSize} from '../constants/constants';
import AAButton from '../ui/button';

interface ProviderErrorProps {
  message?: string;
  hasRetry?: boolean;
  onRetry?: () => void;
}

export default function ProviderError({
  message,
  onRetry,
  hasRetry = true,
}: ProviderErrorProps) {
  return (
    <LayoutWrapper>
      <View style={styles.errorContainer}>
        <AAText ignoretheme style={styles.errorTitle}>
          Oops! Something went wrong.
        </AAText>
        {message ? (
          <AAText style={styles.errorMessage}>{message}</AAText>
        ) : (
          <AAText style={styles.errorMessage}>
            Check your Internet connection or try again later
          </AAText>
        )}
        {hasRetry && onRetry && (
          <AAButton
            ignoreTheme
            title="Retry"
            style={styles.button}
            onPress={onRetry}
            textStyle={styles.buttonText}
          />
        )}
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.Pink,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    marginBottom: 20,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  buttonText: {
    color: Colors.Pink,
  },
  button: {
    borderWidth: 0,
  },
});
