import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FIcons from 'react-native-vector-icons/Feather';

import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import AAButton from '../ui/button';

import {DateItem} from '../constants/types';
import {Colors} from '../constants/constants';

import {generateDates, trimTitle} from '../helper/util.helper';
import {getAnimeDetail, getReleaseSchedule} from '../helper/api.helper';

const {height} = Dimensions.get('window');

type ScheduleItem = {
  id: string;
  url: string;
  title: string;
  image: string;
  airingTime: string;
  japaneseTitle: string;
  airingEpisode: string;
};

export default function CalendarScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const dates: DateItem[] = generateDates();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dates[0]?.id || null,
  );

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const data = await getReleaseSchedule(selectedDate);

        const enrichedSchedule = await Promise.all(
          data.results.map(async (item: ScheduleItem) => {
            try {
              const animeInfo = await getAnimeDetail(item.id);
              return {
                ...item,
                image: animeInfo?.image || 'https://via.placeholder.com/150',
              };
            } catch (error) {
              console.error(
                `Error fetching anime info for ID ${item.id}:`,
                error,
              );
              return {
                ...item,
                image: 'https://via.placeholder.com/150',
              };
            }
          }),
        );

        setSchedule(enrichedSchedule);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate]);

  const handleDatePress = (dateId: string) => {
    setSelectedDate(dateId);
  };

  const renderCalendarItem = ({item}: {item: DateItem}) => {
    const isSelected = selectedDate === item.id;
    return (
      <TouchableOpacity
        style={[styles.calendar, isSelected && styles.selectedCalendar]}
        onPress={() => handleDatePress(item.id)}>
        <AAText style={styles.weekdayText}>{item.weekday}</AAText>
        <AAText style={styles.dateText}>{item.day}</AAText>
      </TouchableOpacity>
    );
  };

  const renderScheduleItem = ({item}: {item: ScheduleItem}) => (
    <View style={styles.scheduleContainer}>
      <View style={styles.time}>
        <View style={styles.smallLine} />
        <AAText>{item.airingTime}</AAText>
      </View>
      <View style={styles.scheduleContent}>
        <Image source={{uri: item.image}} style={styles.image} />
        <View style={styles.col}>
          <AAText style={styles.title}>{trimTitle(item?.title)}</AAText>
          <AAText style={styles.episode}>{item.airingEpisode}</AAText>
          <AAButton
            ignoreTheme
            title="My List"
            style={styles.button}
            textStyle={styles.text}
            onPress={() => console.log('My List Pressed')}
            icon={<FIcons name="plus" size={20} color={Colors.White} />}
          />
        </View>
      </View>
    </View>
  );

  return (
    <LayoutWrapper>
      <View style={styles.container}>
        <AAText style={styles.navText}>Release Calendar</AAText>

        <FlatList
          data={dates}
          horizontal
          style={styles.flatList}
          keyExtractor={item => item.id}
          renderItem={renderCalendarItem}
          showsHorizontalScrollIndicator={false}
        />

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.Green} />
          </View>
        ) : schedule.length > 0 ? (
          <FlatList
            data={schedule}
            style={styles.scheduleList}
            keyExtractor={item => item.id}
            renderItem={renderScheduleItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptySchedule}>
            <Image
              source={require('../../assets/images/sad-removebg.png')}
              style={styles.emptyImage}
            />
            <AAText ignoretheme style={styles.noSchedule}>
              No Release Schedule
            </AAText>
            <AAText style={styles.sorry}>
              sorry, there is no anime release schedule on this date
            </AAText>
          </View>
        )}
      </View>
    </LayoutWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  navText: {
    fontSize: 24,
    fontWeight: '600',
  },
  flatList: {
    marginTop: 20,
    paddingBottom: 20,
  },
  calendar: {
    width: 60,
    height: 90,
    borderWidth: 1,
    marginRight: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.Green,
  },
  selectedCalendar: {
    borderColor: Colors.Green,
    backgroundColor: Colors.Green,
  },
  weekdayText: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleList: {
    marginTop: 20,
  },
  scheduleContainer: {
    paddingTop: 20,
  },
  smallLine: {
    width: 14,
    height: 5,
    borderRadius: 5,
    backgroundColor: Colors.Green,
  },
  time: {
    gap: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  scheduleContent: {
    gap: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  episode: {
    fontSize: 16,
    fontWeight: '400',
  },
  col: {
    gap: 10,
  },
  button: {
    width: 120,
    padding: 8,
    borderRadius: 20,
    borderColor: Colors.Green,
    backgroundColor: Colors.Green,
  },
  text: {
    fontWeight: '600',
    color: Colors.White,
  },
  loading: {
    flex: 1,
    marginBottom: height / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImage: {
    height: 250,
    width: 350,
    resizeMode: 'contain',
  },
  emptySchedule: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height / 2.5,
  },
  noSchedule: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.Green,
  },
  sorry: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
