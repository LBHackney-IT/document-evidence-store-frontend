import { IncomingMessage, ServerResponse } from 'http';
import * as auth from './auth';
import jsonwebtoken from 'jsonwebtoken';
import * as MockCookie from '../../__mocks__/universal-cookie';
import * as Cookie from 'universal-cookie';
import { mocked } from 'ts-jest/utils';

jest.mock('jsonwebtoken');
const mockedJsonWebToken = mocked(jsonwebtoken);

const { mockCookieGet } = (Cookie as unknown) as typeof MockCookie;

describe('auth helpers', () => {
  describe('createLoginUrl', () => {
    it('returns a google auth url', () => {
      const path = '/foo';
      const expected = `https://auth.hackney.gov.uk/auth?redirect_uri=${process.env.RUNTIME_APP_URL}${path}`;

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
      const path = '/login';

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

  describe('authorize', () => {
    const req = {
      headers: {
        cookie: '',
      },
    } as IncomingMessage;

    it('returns undefined when the cookie does not exist', () => {
      mockCookieGet.mockImplementation(() => null);

      expect(auth.authoriseUser(req)).toBeUndefined();
    });

    describe('when the cookie exists', () => {
      const cookieValue = 'cookie';

      beforeEach(() => {
        mockCookieGet.mockImplementation(() => cookieValue);
      });

      it('returns a user when the JWT is valid', () => {
        const jwtPayload = {
          groups: [],
          name: 'user',
          email: 'user@email',
        };
        mockedJsonWebToken.verify.mockImplementation(() => jwtPayload);

        expect(auth.authoriseUser(req)).toEqual(jwtPayload);
        expect(mockedJsonWebToken.verify).toHaveBeenCalledWith(
          cookieValue,
          process.env.HACKNEY_JWT_SECRET
        );
      });

      it('throws an error when the user is not authorised', () => {
        mockedJsonWebToken.verify.mockImplementation(() => {
          throw new jsonwebtoken.JsonWebTokenError('error message');
        });

        expect(auth.authoriseUser(req)).toBeUndefined();
        expect(mockedJsonWebToken.verify).toHaveBeenCalledWith(
          cookieValue,
          process.env.HACKNEY_JWT_SECRET
        );
      });
    });
  });

  describe('unsafeExtractUser', () => {
    it('returns undefined when the cookie does not exist', () => {
      mockCookieGet.mockImplementation(() => null);

      expect(auth.unsafeExtractUser()).toBeUndefined();
    });

    describe('when the cookie exists', () => {
      const cookieValue = 'cookie';

      beforeEach(() => {
        mockCookieGet.mockImplementation(() => cookieValue);
      });

      it('returns a user when the JWT is valid', () => {
        const jwtPayload = {
          groups: [],
          name: 'user',
          email: 'user@email',
        };
        mockedJsonWebToken.decode.mockImplementation(() => jwtPayload);

        expect(auth.unsafeExtractUser()).toEqual(jwtPayload);
        expect(mockedJsonWebToken.decode).toHaveBeenCalledWith(cookieValue);
      });

      it('returns undefined when the JWT is not valid', () => {
        mockedJsonWebToken.decode.mockImplementation(() => null);

        expect(auth.unsafeExtractUser()).toEqual(null);
        expect(mockedJsonWebToken.decode).toHaveBeenCalledWith(cookieValue);
      });
    });
  });

  describe('serverSideRedirect', () => {
    const location = 'location';

    it('redirects server side', () => {
      const res = {} as ServerResponse;
      res.writeHead = jest.fn();
      res.end = jest.fn();
      auth.serverSideRedirect(res, location);
      expect(res.writeHead).toHaveBeenCalledWith(302, { Location: location });
    });
  });
});
