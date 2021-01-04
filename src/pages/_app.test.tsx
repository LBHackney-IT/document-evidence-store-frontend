import { render } from '@testing-library/react';
import App from './_app';
import React from 'react';
import * as authHelpers from '../helpers/auth';
import { mocked } from 'ts-jest/utils';
import { IncomingMessage, ServerResponse } from 'http';
import { NextPage, NextPageContext } from 'next';
import NextApp, { AppContext, AppInitialProps } from 'next/app';
import CustomApp from './_app';

jest.mock('../helpers/auth');
jest.mock('next/app');

const {
  authoriseUser,
  pathIsWhitelisted,
  userIsInValidGroup,
  serverSideRedirect,
} = mocked(authHelpers);

const MockedNextApp = mocked(NextApp);
const pageProps = ({ foo: 'bar' } as unknown) as AppInitialProps;
MockedNextApp.getInitialProps.mockImplementation(async () => pageProps);

describe('CustomApp', () => {
  const pageComponent = (jest.fn(() => <p>Hello</p>) as unknown) as NextPage;

  it('if the page is public returns the component with the right props', () => {
    render(<App Component={pageComponent} pageProps={pageProps} />);
    expect(pageComponent).toHaveBeenCalledWith(pageProps, {});
  });

  describe('getServerSideProps', () => {
    const req = {} as IncomingMessage;
    const res = {} as ServerResponse;
    const ctx = { req, res, pathname: '/path' } as NextPageContext;
    const appContext = { ctx } as AppContext;

    describe('when the user is not logged in', () => {
      beforeEach(() => {
        authoriseUser.mockImplementation(() => undefined);
      });

      it('redirects to google when the page is private', async () => {
        pathIsWhitelisted.mockImplementation(() => false);
        await CustomApp.getInitialProps(appContext);

        expect(serverSideRedirect).toHaveBeenCalledWith(
          res,
          `/login?redirect=${ctx.pathname}`
        );
      });

      it('returns empty props when the page is public', async () => {
        pathIsWhitelisted.mockImplementation(() => true);
        const result = await CustomApp.getInitialProps(appContext);

        expect(result).toEqual(pageProps);
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
        await CustomApp.getInitialProps(appContext);

        expect(serverSideRedirect).toHaveBeenCalledWith(res, '/access-denied');
      });

      it('returns the user in props when the user is in a valid group', async () => {
        userIsInValidGroup.mockImplementation(() => true);
        const result = await CustomApp.getInitialProps(appContext);

        expect(result).toEqual({ ...pageProps, user });
      });

      it('returns the props and reloads the page when the page is rendered client side and is private', async () => {
        const ctx = { pathname: '/path' } as NextPageContext;
        const clientSideContext = { ctx } as AppContext;
        pathIsWhitelisted.mockImplementation(() => false);
        const result = await CustomApp.getInitialProps(clientSideContext);

        expect(result).toEqual({ ...pageProps, reloading: true });
      });
    });
  });
});
