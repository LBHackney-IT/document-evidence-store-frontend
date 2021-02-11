import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { User } from 'src/domain/user';
import * as RequestAuthorizer from 'src/services/request-authorizer';
import * as MockRequestAuthorizer from 'src/services/__mocks__/request-authorizer';
import { AuthenticationError } from '../../types/auth-errors';
import { withAuth } from './authed-server-side-props';

jest.mock('../services/request-authorizer');

const {
  executeMock,
} = (RequestAuthorizer as unknown) as typeof MockRequestAuthorizer;

describe('withAuth', () => {
  const props = { important: 'prop' };
  const inputFn = jest.fn(async () => ({ props }));
  let getServerSideProps: GetServerSideProps;
  const ctx = {
    resolvedUrl: '/path',
    req: { headers: { cookie: 'cookie header' } },
  } as GetServerSidePropsContext;
  const user = {} as User;

  beforeEach(() => {
    getServerSideProps = withAuth(inputFn);
    executeMock.mockReturnValue({
      success: true,
      user,
    });
  });

  it('calls the authorizer with the correct command', async () => {
    await getServerSideProps(ctx);

    expect(executeMock).toHaveBeenCalledWith({
      path: '/path',
      cookieHeader: 'cookie header',
    });
  });

  it('returns the correct props', async () => {
    const result = await getServerSideProps(ctx);

    expect(result).toEqual({ props: { ...props, user } });
  });

  describe('when there is no gssp input function provided', () => {
    beforeEach(() => {
      getServerSideProps = withAuth();
    });

    it('returns just the user', async () => {
      const result = await getServerSideProps(ctx);

      expect(result).toEqual({ props: { user } });
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      executeMock.mockReturnValue({
        success: false,
        error: AuthenticationError.InvalidToken,
      });
    });

    it('redirects to the login page', async () => {
      const result = await getServerSideProps(ctx);

      expect(result).toEqual({
        redirect: {
          destination: '/login?redirect=%2Fpath',
          permanent: false,
        },
      });
    });
  });

  describe('when user is not in a valid google group', () => {
    beforeEach(() => {
      executeMock.mockReturnValue({
        success: false,
        error: AuthenticationError.GoogleGroupNotRecognised,
      });
    });

    it('redirects to the access denied page', async () => {
      const result = await getServerSideProps(ctx);

      expect(result).toEqual({
        redirect: {
          destination: '/access-denied',
          permanent: false,
        },
      });
    });
  });
});
