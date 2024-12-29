import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AAText from '../../ui/text';
import {useTheme} from '../../wrappers/theme-context';
import {Colors, FontSize} from '../../constants/constants';
import LayoutWrapper from '../../wrappers/layout-wrapper';

type NoInternetConnectionScreenProps = {
  onRetry: () => void;
  loading: boolean;
};

export default function NoInternetConnectionScreen({
  onRetry,
  loading,
}: NoInternetConnectionScreenProps) {
  const {theme} = useTheme();

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <FeatherIcon name="wifi-off" size={50} color={theme.colors.text} />
        <AAText style={styles.text}>No Internet Connection</AAText>
        <TouchableOpacity
          style={[styles.refreshButton, loading && styles.disabledButton]}
          onPress={onRetry}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <Ionicons name="reload" size={20} color={theme.colors.text} />
          )}
        </TouchableOpacity>
      </View>
    </LayoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    maxWidth: 300,
    textAlign: 'center',
    fontSize: FontSize.lg,
  },
  refreshButton: {
    width: 80,
    height: 50,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: Colors.Pink,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
