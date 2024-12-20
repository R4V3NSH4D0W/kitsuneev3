import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Episode} from '../constants/types';
import {Colors} from '../constants/constants';
import AAText from '../ui/text';
import AIcons from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../wrappers/theme-context';
interface IAADropDownProps {
  episodes: Episode[];
  onRangeSelected: (range: {start: number; end: number}) => void;
  selectedRange?: {start: number; end: number};
}

export default function AADropDown({
  episodes,
  onRangeSelected,
  selectedRange: parentSelectedRange,
}: IAADropDownProps) {
  const [selectedRange, setSelectedRange] = useState<{
    label: string;
    value: {start: number; end: number};
  } | null>(null);
  const {theme} = useTheme();
  const dropdownData = useMemo(() => {
    const episodeCount = episodes.length;
    const ranges = [];
    const increment = 100;

    for (let start = 1; start <= episodeCount; start += increment) {
      const end = Math.min(start + increment - 1, episodeCount);
      ranges.push({
        label: `EPS: ${start}-${end}`,
        value: {start, end},
      });
    }
    return ranges;
  }, [episodes]);

  useEffect(() => {
    if (parentSelectedRange) {
      const matchedRange = dropdownData.find(
        range =>
          range.value.start === parentSelectedRange.start &&
          range.value.end === parentSelectedRange.end,
      );
      setSelectedRange(matchedRange || dropdownData[0]);
      onRangeSelected(matchedRange?.value || dropdownData[0]?.value);
    } else {
      setSelectedRange(dropdownData[0]);
      onRangeSelected(dropdownData[0]?.value);
    }
  }, [parentSelectedRange, dropdownData, onRangeSelected]);

  const handleSelect = (item: {
    label: string;
    value: {start: number; end: number};
  }) => {
    setSelectedRange(item);
    onRangeSelected(item.value);
  };

  const renderCustomItem = (item: {
    label: string;
    value: {start: number; end: number};
  }) => {
    const isSelected = selectedRange?.value.start === item.value.start;
    return (
      <View style={[styles.dropdownItem, isSelected && styles.selectedItem]}>
        <AAText>{item.label}</AAText>
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      containerStyle={styles.dropdownContainer}
      itemTextStyle={{color: Colors.Pink}}
      selectedTextStyle={{color: Colors.Pink}}
      showsVerticalScrollIndicator={false}
      iconColor={Colors.Pink}
      data={dropdownData}
      labelField="label"
      valueField="value"
      value={selectedRange}
      onChange={handleSelect}
      renderItem={renderCustomItem}
      renderLeftIcon={() => (
        <View style={styles.DropDownIcon}>
          <AIcons name="filter" size={20} color={theme.colors.text} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: Colors.LightGray,
    borderWidth: 0,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.LightGray,
  },
  selectedItem: {
    backgroundColor: Colors.Pink,
  },
  DropDownIcon: {
    paddingRight: 10,
  },
});
