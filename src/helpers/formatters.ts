import { DateTime } from 'luxon';
import DOMPurify from 'isomorphic-dompurify';

export const stringToMarkup = (string: string): { __html: string } => {
  return { __html: DOMPurify.sanitize(string) };
};

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
export const formatDate = (dateTime: DateTime | undefined | string): string => {
  if (!dateTime) {
    return '';
  }
  if (typeof dateTime == 'string') {
    dateTime = DateTime.fromISO(dateTime);
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
