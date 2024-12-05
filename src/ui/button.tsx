import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  View,
  TextStyle,
} from 'react-native';
import AAText from './text';

interface IAAButtonProps {
  title: string | number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  textStyle?: TextStyle;
  ignoreTheme?: boolean;
}

const AAButton = ({
  title,
  style,
  onPress,
  icon,
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
