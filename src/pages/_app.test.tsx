import { render } from '@testing-library/react';
import App, { getServerSideProps } from './_app';
import React from 'react';
import { PageComponent } from '../../types/page-component';
import * as authHelpers from '../helpers/auth';
import { mocked } from 'ts-jest/utils';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsContext } from 'next';

jest.mock('../helpers/auth');

const {
  authoriseUser,
  pathIsWhitelisted,
  userIsInValidGroup,
  createLoginUrl,
} = mocked(authHelpers);

describe('CustomApp', () => {
  const pageComponent = (jest.fn(() => (
    <p>Hello</p>
  )) as unknown) as PageComponent;
  const pageProps = { foo: 'bar' };

  it('if the page is public returns the component with the right props', () => {
    render(<App Component={pageComponent} pageProps={pageProps} />);
    expect(pageComponent).toHaveBeenCalledWith(pageProps, {});
  });

  describe('getServerSideProps', () => {
    const req = { url: '/path' } as IncomingMessage;
    const res = {} as ServerResponse;
    const ctx = { req, res } as GetServerSidePropsContext;

    describe('when the user is not logged in', () => {
      beforeEach(() => {
        authoriseUser.mockImplementation(() => undefined);
      });

      it('redirects to google when the page is private', async () => {
        const loginUrl = 'i am a google auth url';

        createLoginUrl.mockImplementation(() => loginUrl);
        pathIsWhitelisted.mockImplementation(() => false);

        const result = await getServerSideProps(ctx);

        expect(result).toEqual({
          props: {},
          redirect: {
            destination: loginUrl,
            permanent: false,
          },
        });
      });

      it('returns empty props when the page is public', async () => {
        pathIsWhitelisted.mockImplementation(() => true);
        const result = await getServerSideProps(ctx);

        expect(result).toEqual({ props: {} });
      });
    });

    describe('when the user is logged in', () => {
      const user: authHelpers.User = {
        groups: ['testGroup'],
        name: 'Frodo Baggins',
        email: 'frodo@baggins.com',
        isAuthorised: true,
      };

      beforeEach(() => {
        authoriseUser.mockImplementation(() => user);
        pathIsWhitelisted.mockImplementation(() => false);
      });

      it('redirects to `access denied` when the user is not in a valid group', async () => {
        userIsInValidGroup.mockImplementation(() => false);
        const result = await getServerSideProps(ctx);

        expect(result).toEqual({
          props: {},
          redirect: {
            destination: '/access-denied',
            permanent: false,
          },
        });
      });

      it('returns the user in props when the user is in a valid group', async () => {
        userIsInValidGroup.mockImplementation(() => true);
        const result = await getServerSideProps(ctx);

        expect(result).toEqual({ props: { user } });
      });
    });
  });
});
