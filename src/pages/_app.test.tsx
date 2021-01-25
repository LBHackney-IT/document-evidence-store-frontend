import { render } from '@testing-library/react';
import App, { CustomAppProps } from './_app';
import React from 'react';
import * as RequestAuthorizer from '../services/request-authorizer';
import * as MockRequestAuthorizer from '../services/__mocks__/request-authorizer';
import { mocked } from 'ts-jest/utils';
import { IncomingMessage, ServerResponse } from 'http';
import { NextPage, NextPageContext } from 'next';
import NextApp, { AppContext, AppInitialProps } from 'next/app';
import CustomApp from './_app';
import { User } from '../domain/user';
import { Router } from 'next/router';

jest.mock('../services/request-authorizer');
jest.mock('next/app');

const { executeMock } = RequestAuthorizer as typeof MockRequestAuthorizer;

const MockedNextApp = mocked(NextApp);
const pageProps = ({ foo: 'bar' } as unknown) as AppInitialProps;
MockedNextApp.getInitialProps.mockImplementation(async () => pageProps);

describe('CustomApp', () => {
  const pageComponent = (jest.fn(() => <p>Hello</p>) as unknown) as NextPage;

  it('renders the component with the right props', () => {
    render(<App Component={pageComponent} pageProps={pageProps} />);
    expect(pageComponent).toHaveBeenCalledWith(pageProps, {});
  });

  describe('getServerSideProps', () => {
    const req = {} as IncomingMessage;
    const res = {} as ServerResponse;
    req.headers = { cookie: 'cookie' };
    res.writeHead = jest.fn();
    res.end = jest.fn();

    const router = {} as Router;
    router.replace = jest.fn();

    const clientCtx = {
      asPath: '/path',
    } as NextPageContext;

    const serverCtx = {
      ...clientCtx,
      req,
      res,
    };

    const serverContext = { ctx: serverCtx } as AppContext;
    const clientContext = { ctx: clientCtx, router } as AppContext;

    describe('when authentication fails', () => {
      const redirect = 'redirect url';
      let result: CustomAppProps;

      beforeEach(() => {
        executeMock.mockReturnValue({ success: false, redirect });
      });

      describe('on server side', () => {
        beforeEach(async () => {
          result = await CustomApp.getInitialProps(serverContext);
        });

        it('calls the authorizer correctly', () => {
          expect(executeMock).toHaveBeenCalledWith({
            serverSide: true,
            cookieHeader: req.headers.cookie,
            path: serverCtx.asPath,
          });
        });

        it('redirects to the redirect url', async () => {
          expect(res.writeHead).toHaveBeenCalledWith(302, {
            Location: redirect,
          });
          expect(res.end).toHaveBeenCalled();
        });

        it('blocks the frontend while redirect occurs', () => {
          expect(result).toEqual({ ...pageProps, accessDenied: true });
        });
      });

      describe('on client side', () => {
        beforeEach(async () => {
          result = await CustomApp.getInitialProps(clientContext);
        });

        it('calls the authorizer correctly', () => {
          expect(executeMock).toHaveBeenCalledWith({
            serverSide: false,
            cookieHeader: undefined,
            path: clientCtx.asPath,
          });
        });

        it('redirects to the redirect url', async () => {
          expect(router.replace).toHaveBeenCalledWith(redirect);
        });

        it('blocks the frontend while redirect occurs', () => {
          expect(result).toEqual({ ...pageProps, accessDenied: true });
        });
      });
    });

    describe('when authentication succeeds', () => {
      const user: User = {
        groups: ['testGroup'],
        name: 'Frodo Baggins',
        email: 'frodo@baggins.com',
      };
      let result: CustomAppProps;

      beforeEach(async () => {
        executeMock.mockReturnValue({ success: true, user });
        result = await CustomApp.getInitialProps(serverContext);
      });

      it('returns the user', () => {
        expect(result).toEqual({
          ...pageProps,
          user: user,
          accessDenied: false,
        });
      });
    });
  });
});
