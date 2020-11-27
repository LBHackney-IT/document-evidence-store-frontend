import * as auth from './auth';

describe('auth helpers', () => {
  describe('createLoginUrl', () => {
    it('returns a google auth url', () => {
      const path = '/foo';
      const expected = `https://auth.hackney.gov.uk/auth?redirect_uri=http://localdev.hackney.gov.uk${path}`;

      expect(auth.createLoginUrl(path)).toEqual(expected);
    });
  });

  describe('pathIsWhitelisted', () => {
    describe('for a non-whitelisted path', () => {
      const path = '/nope';

      it('returns false', () => {
        expect(auth.pathIsWhitelisted(path)).toEqual(false);
      });
    });

    describe('for a whitelisted path', () => {
      const path = '/';

      it('returns true', () => {
        expect(auth.pathIsWhitelisted(path)).toEqual(true);
      });
    });
  });
});
