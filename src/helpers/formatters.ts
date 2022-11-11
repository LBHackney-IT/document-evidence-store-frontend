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

// For example: 10:15 am 5 Jun 2020 (2 days ago)
export const formatDate = (dateTime: DateTime | undefined): string => {
  if (!dateTime) {
    return '';
  }
  if (!dateTime.isValid) {
    console.log(`Invalid dateTime: ${dateTime.toLocaleString()}`);
    return '';
  }
  return (
    dateTime.setLocale('en-gb').toFormat('h:mm a d LLLL y') +
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
