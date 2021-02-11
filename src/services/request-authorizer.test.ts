import {
  RequestAuthorizer,
  RequestAuthorizerResponse,
} from './request-authorizer';
import * as jwt from 'jsonwebtoken';
import * as Cookie from 'universal-cookie';
import * as MockCookie from '../../__mocks__/universal-cookie';
import { mocked } from 'ts-jest/utils';
import { User } from '../domain/user';
import { AuthenticationError } from '../../types/auth-errors';

jest.mock('jsonwebtoken');
jest.mock('universal-cookie');
const mockJWT = mocked(jwt);
const jwtPayload = {
  groups: ['valid-group'],
  name: 'frodo',
  email: 'frodo@bag.end',
} as User;
const cookieName = 'cookieName';
const secret = 'secret';
const token = 'token';

const {
  mockCookieGet,
  default: mockCookie,
} = (Cookie as unknown) as typeof MockCookie;

describe('Request Authorizer', () => {
  let instance: RequestAuthorizer;
  let result: RequestAuthorizerResponse;

  beforeEach(() => {
    mockCookieGet.mockReturnValue(token);
    instance = new RequestAuthorizer({
      cookieName,
      secret,
      environmentKey: 'production',
      authGroups: { VALID: 'valid-group' },
    });
  });

  describe('when the token is invalid', () => {
    beforeEach(() => {
      mockJWT.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError('oh no');
      });

      mockJWT.decode.mockReturnValue(null);
    });

    it('tries to verify the token', () => {
      const cookieHeader = 'cookie header';
      instance.execute({ path: '/', cookieHeader });

      expect(mockCookie).toHaveBeenCalledWith(cookieHeader);
      expect(mockJWT.verify).toHaveBeenCalledWith(token, secret);
    });

    it('fails and redirects to the login page', () => {
      result = instance.execute({ path: '/' });

      if (result.success) fail('Should be a faillure');

      expect(result.success).toBeFalsy();
      expect(result.error).toEqual(AuthenticationError.InvalidToken);
    });

    describe('but the page is whitelisted', () => {
      beforeEach(() => {
        instance = new RequestAuthorizer({
          cookieName,
          secret,
          environmentKey: 'production',
          authGroups: { VALID: 'valid-group' },
          authWhitelist: [/\//],
        });
      });

      it('tries to verify the token', () => {
        const cookieHeader = 'cookie header';
        instance.execute({
          path: '/?foo=bar#title',
          cookieHeader,
        });

        expect(mockCookie).toHaveBeenCalledWith(cookieHeader);
        expect(mockJWT.verify).toHaveBeenCalledWith(token, secret);
      });

      it('succeeds', () => {
        result = instance.execute({ path: '/' });

        if (!result.success) fail('Should be a success');

        expect(result.success).toBeTruthy();
        expect(result.user).toBe(undefined);
      });
    });

    describe('in development', () => {
      beforeEach(() => {
        instance = new RequestAuthorizer({
          cookieName,
          secret,
          environmentKey: 'dev',
        });
      });

      it('does not try to verify the token', () => {
        const cookieHeader = 'cookie header';
        instance.execute({ path: '/', cookieHeader });

        expect(mockCookie).toHaveBeenCalledWith(cookieHeader);
        expect(mockJWT.decode).toHaveBeenCalledWith(token);
      });
    });
  });

  describe('when the user is logged in', () => {
    /* seemingly ts-jest can't handle function overloads very well,
     * so expects the return type to match `void` (despite this function
     * also working synchronously to return a value)
     */
    type MockVerify = jest.MockedFunction<() => User>;
    beforeEach(() => {
      ((mockJWT.verify as unknown) as MockVerify).mockReturnValue(jwtPayload);
    });

    it('succeeds', () => {
      result = instance.execute({ path: '/' });

      if (!result.success) fail('Should be a success');

      expect(result.success).toBeTruthy();
      expect(result.user).toBe(jwtPayload);
    });

    describe('but not part of a valid group', () => {
      beforeEach(() => {
        ((mockJWT.verify as unknown) as MockVerify).mockReturnValue({
          ...jwtPayload,
          groups: ['other-group'],
        });
      });

      it('fails and redirects to access denied', () => {
        result = instance.execute({ path: '/' });

        if (result.success) fail('Should be a faillure');

        expect(result.success).toBeFalsy();
        expect(result.error).toEqual(
          AuthenticationError.GoogleGroupNotRecognised
        );
      });
    });
  });
});
