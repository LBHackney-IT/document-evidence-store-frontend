import { humanFileSize } from './formatters';

describe('File size helper', () => {
  it('returns correct strings with the right number of decimal places', () => {
    expect(humanFileSize(0)).toEqual('0.0 B');
    expect(humanFileSize(1024)).toEqual('1.0 KB');
    expect(humanFileSize(1073741824)).toEqual('1.0 GB');
  });
});
