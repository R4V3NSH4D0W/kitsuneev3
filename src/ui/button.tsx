import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import AAText from './text';

interface IAAButtonProps {
  onPress: () => void;
  textStyle?: TextStyle;
  ignoreTheme?: boolean;
  title: string | number;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AAButton = ({
  icon,
  title,
  style,
  onPress,
  textStyle,
  ignoreTheme,
}: IAAButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}

        <AAText style={textStyle} ignoretheme={ignoreTheme}>
          {title}
        </AAText>
      </View>
    </TouchableOpacity>
  );
};

export default AAButton;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
});
