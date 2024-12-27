import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import FIcon from 'react-native-vector-icons/Feather';
import IIcons from 'react-native-vector-icons/Ionicons';
import AAText from '../../ui/text';
import {useTheme} from '../../wrappers/theme-context';
import {Colors, FontSize} from '../../constants/constants';

type NoInternetConnectionScreenProps = {
  onRetry: () => void;
  loading: boolean;
};

export default function NoInternetConnectionScreen({
  onRetry,
  loading,
}: NoInternetConnectionScreenProps) {
  const {theme} = useTheme();
  console.log(loading);

  return (
    <View style={styles.container}>
      <FIcon name="wifi-off" size={50} color={theme.colors.text} />
      <AAText style={styles.text}>No Internet Connection</AAText>
      <TouchableOpacity
        disabled={loading}
        style={styles.refreshButton}
        onPress={onRetry}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.text} />
        ) : (
          <IIcons name="reload" size={20} color={theme.colors.text} />
        )}
      </TouchableOpacity>
    </View>
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
});
