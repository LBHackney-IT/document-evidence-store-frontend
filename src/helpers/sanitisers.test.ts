import { sanitiseNoteToResident } from './sanitisers';

describe('Sanitise noteToResident', () => {
  for (const { input, expected } of [
    { input: '     ', expected: '' },
    { input: '    note   ', expected: 'note' },
    { input: 'note to resident', expected: 'note to resident' },
  ]) {
    it(`returns '${expected}' when '${input}' is passed`, () => {
      const actual = sanitiseNoteToResident(input);

      expect(actual).toEqual(expected);
    });
  }
});
