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
