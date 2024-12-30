import {DateItem} from '../constants/types';

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const generateDates = (daysToShow = 30): DateItem[] => {
  const today = new Date();
  const dates: DateItem[] = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push({
      id: formatDate(date),
      day: date.getDate(),
      weekday: date.toLocaleString('en-US', {weekday: 'short'}),
    });
  }
  return dates;
};

export const trimTitle = (title: string, maxLength: number = 28): string => {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
};

export const getDeviceDate = (
  locale: string = 'en-US',
): {weekday: string; date: string; time: string} => {
  const currentDate = new Date();

  const weekday = currentDate
    .toLocaleDateString(locale, {weekday: 'short'})
    .toLowerCase();
  const date = currentDate.toISOString().split('T')[0];
  const time = currentDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return {weekday, date, time};
};

const parseTimeStringToMinutes = (timeString: string | undefined): number => {
  if (!timeString) {
    return 0;
  }

  const [hours, minutes] = timeString.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
};

const checkTime = (
  currentTime: string | undefined,
  airingTime: string | undefined,
  previousTime: string | undefined,
): boolean => {
  const currentMinutes = parseTimeStringToMinutes(currentTime);
  const airingMinutes = parseTimeStringToMinutes(airingTime);
  const previousMinutes = previousTime
    ? parseTimeStringToMinutes(previousTime)
    : 0;

  if (currentMinutes < airingMinutes && currentMinutes >= previousMinutes) {
    return true;
  }
  return false;
};

export const checkDate = (
  selectedDate: string,
  currentDate: string | undefined,
  currentTime: string | undefined,
  airingTime: string | undefined,
  previousTime: string | undefined,
): boolean => {
  if (selectedDate === currentDate) {
    return checkTime(currentTime, airingTime, previousTime);
  }

  return false;
};

export const trimRating = (rating: string) => {
  return rating.split(' -')[0];
};

export const parseReleaseNotes = (releaseNotes: string) => {
  const sectionRegex = /# (.*?)\n/g;
  const listItemRegex = /(\d+\.\s.*?)(?=\n|\r|$)/g;

  const sections = [];
  let match;
  while ((match = sectionRegex.exec(releaseNotes)) !== null) {
    const sectionTitle = match[1];
    const sectionStart = match.index + match[0].length;
    const sectionEnd = sectionRegex.lastIndex;
    const sectionContent = releaseNotes.slice(sectionStart, sectionEnd).trim();

    const items = sectionContent.match(listItemRegex) || [];

    sections.push({
      title: sectionTitle,
      items,
    });
  }

  return sections;
};
