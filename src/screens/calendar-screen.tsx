import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LayoutWrapper from '../wrappers/layout-wrapper';
import AAText from '../ui/text';
import {Colors} from '../constants/constants';
import {getAnimeDetail, getReleaseSchedule} from '../helper/api.helper';
import AAButton from '../ui/button';
import FIcons from 'react-native-vector-icons/Feather';
import {DateItem} from '../constants/types';
import {generateDates, trimTitle} from '../helper/util.helper';

const {height} = Dimensions.get('window');

type ScheduleItem = {
  id: string;
  title: string;
  japaneseTitle: string;
  url: string;
  airingEpisode: string;
  airingTime: string;
  image: string;
};

export default function CalendarScreen() {
  const dates: DateItem[] = generateDates();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    dates[0]?.id || null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

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
            title="My List"
            ignoreTheme
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
          keyExtractor={item => item.id}
          renderItem={renderCalendarItem}
          showsHorizontalScrollIndicator={false}
          style={styles.flatList}
        />

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.Green} />
          </View>
        ) : schedule.length > 0 ? (
          <FlatList
            data={schedule}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={renderScheduleItem}
            style={styles.scheduleList}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1, // Ensure the container takes the full height
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
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.Green,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 90,
  },
  selectedCalendar: {
    backgroundColor: Colors.Green,
    borderColor: Colors.Green,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  scheduleContent: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    gap: 10,
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
    backgroundColor: Colors.Green,
    borderColor: Colors.Green,
  },
  text: {
    color: Colors.White,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    marginBottom: height / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    height: 250,
    width: 350,
    resizeMode: 'contain',
  },
  emptySchedule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height / 2.5,
  },
  noSchedule: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.Green,
  },
  sorry: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
    paddingHorizontal: 30,
  },
});
