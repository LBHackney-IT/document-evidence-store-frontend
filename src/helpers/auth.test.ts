import { IncomingMessage } from 'http';
import * as auth from './auth';
import cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { mocked } from 'ts-jest/utils';

jest.mock('cookie');
jest.mock('jsonwebtoken');
const mockedCookie = mocked(cookie);
const mockedJsonWebToken = mocked(jsonwebtoken);
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

  describe('userIsInValidGroup', () => {
    it('returns true when user is in a valid group', () => {
      const user = {
        isAuthorised: true,
        groups: ['development-team-staging'],
        name: 'some name',
        email: 'some@email',
      };

      expect(auth.userIsInValidGroup(user)).toBe(true);
    });

    it('returns false when user is in a valid group', () => {
      const user = {
        isAuthorised: true,
        groups: ['some-group'],
        name: 'some name',
        email: 'some@email',
      };

      expect(auth.userIsInValidGroup(user)).toBe(false);
    });
  });

  describe('authoriseUser', () => {
    it('returns undefined when the cookie does not exist', () => {
      const req = {
        headers: {
          cookie: '',
        },
      } as IncomingMessage;

      mockedCookie.parse.mockImplementation(() => ({}));

      expect(auth.authoriseUser(req)).toBeUndefined();
    });

    it('returns a user when the cookie exists', () => {
      const req = {
        headers: {
          cookie: '',
        },
      } as IncomingMessage;

      mockedCookie.parse.mockImplementation(() => ({
        hackneyToken: 'some cookie',
      }));

      const jwtPayload = {
        groups: [],
        name: 'user',
        email: 'user@email',
      };
      mockedJsonWebToken.verify.mockImplementation(() => jwtPayload);

      expect(auth.authoriseUser(req)).toEqual({
        ...jwtPayload,
        isAuthorised: true,
      });
    });

    it('throws an error when the user is not authorised', () => {
      const req = {
        headers: {
          cookie: '',
        },
      } as IncomingMessage;

      mockedCookie.parse.mockImplementation(() => ({
        hackneyToken: 'some cookie',
      }));

      mockedJsonWebToken.verify.mockImplementation(() => {
        throw new jsonwebtoken.JsonWebTokenError('error message');
      });
      expect(auth.authoriseUser(req)).toBeUndefined();
    });
  });
});
