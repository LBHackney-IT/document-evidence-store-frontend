import { DateTime } from 'luxon';

export const humanFileSize = (bytes: number): string => {
  if (bytes == 0) {
    return '0.0 B';
  }
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, e)).toFixed(1) + ' ' + ' KMGTP'.charAt(e) + 'B'
  );
};

// For example: 14:15 5 Jun 2020 (2 days ago)
export const formatDate = (dateTime: DateTime): string => {
  return (
    dateTime.setLocale('en-gb').toFormat('t d LLLL y') +
    ' (' +
    dateTime.toRelativeCalendar() +
    ')'
  );
};

export const formatDateWithoutTime = (dateTime: DateTime): string => {
  return dateTime.toLocal().toFormat('d LLLL y');
};

export const formatRelativeCalendarDate = (dateTime: DateTime): string => {
  return '' + dateTime.toRelativeCalendar();
};
