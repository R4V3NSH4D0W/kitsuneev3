import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AAText from '../ui/text';
import AAButton from '../ui/button';
import {Colors} from '../constants/constants';

interface ISortFilterCardProps {
  title: string;
  data: {id: number; title: string}[];
  onPress: (selected: {id: number; title: string}) => void;
  isMultiSelect?: boolean;
  reset?: boolean;
}

export default function SortFilterCard({
  title,
  data,
  onPress,
  isMultiSelect = false,
  reset = false,
}: ISortFilterCardProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!isMultiSelect && data.length > 0 && selectedIds.length === 0) {
      const firstItem = data[0];
      setSelectedIds([firstItem.id]);
      onPress(firstItem);
    }
  }, [data, isMultiSelect, onPress, selectedIds]);

  useEffect(() => {
    if (reset) {
      setSelectedIds([]);
    }
  }, [reset, onPress]);

  const handleSelection = (item: {id: number; title: string}) => {
    if (isMultiSelect) {
      const newSelection = selectedIds.includes(item.id)
        ? selectedIds.filter(id => id !== item.id)
        : [...selectedIds, item.id];
      setSelectedIds(newSelection);
      onPress({id: item.id, title: item.title});
    } else {
      if (selectedIds[0] !== item.id) {
        setSelectedIds([item.id]);
        onPress({id: item.id, title: item.title});
      }
    }
  };

  return (
    <View style={styles.container}>
      <AAText style={styles.title}>{title}</AAText>
      <View style={styles.cardContainer}>
        {data.map(item => (
          <AAButton
            ignoreTheme
            key={item.id}
            title={item.title}
            textStyle={{
              color: selectedIds.includes(item.id)
                ? Colors.White
                : Colors.LightGray,
            }}
            onPress={() => handleSelection(item)}
            style={[
              styles.button,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                borderColor: selectedIds.includes(item.id)
                  ? Colors.Pink
                  : Colors.LightGray,
                backgroundColor: selectedIds.includes(item.id)
                  ? Colors.Pink
                  : 'transparent',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  cardContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    padding: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
