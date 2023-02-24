import { formatDate, humanFileSize } from './formatters';
import { DateTime } from 'luxon';

describe('File size helper', () => {
  it('returns correct strings with the right number of decimal places', () => {
    expect(humanFileSize(0)).toEqual('0.0 B');
    expect(humanFileSize(1024)).toEqual('1.0 KB');
    expect(humanFileSize(1073741824)).toEqual('1.0 GB');
  });
});

describe('Format date helper', () => {
  it('returns the correctly formatted', () => {
    const formattedDate = formatDate(
      DateTime.local(2021, 4, 14, 18, 21).setLocale('en-gb')
    );
    // do not compare the second part of the formatted date because it contains relative days so will change
    expect(formattedDate.substr(0, 21).toLocaleLowerCase()).toEqual('6:21 pm 14 april 2021');
  });
});
