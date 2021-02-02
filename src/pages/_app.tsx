import { NextPage } from 'next';
import App, { AppContext, AppProps } from 'next/app';
import React from 'react';
import { User } from '../domain/user';
import { AccessDeniedPage } from '../components/AccessDeniedPage';
import { UserContext } from '../contexts/UserContext';
import {
  RequestAuthorizer,
  RequestAuthorizerCommand,
} from '../services/request-authorizer';
import '../styles/globals.scss';
import { AuthenticationError } from '../../types/auth-errors';
import '../helpers/register-domain';

export type CustomAppProps = {
  pageProps: AppProps['pageProps'];
  user?: User;
  accessDenied?: boolean;
};

const CustomApp = ({
  Component,
  pageProps,
  user,
  accessDenied,
}: CustomAppProps & { Component: NextPage }): JSX.Element | null => {
  if (accessDenied) return <AccessDeniedPage />;

  return (
    <UserContext.Provider value={{ user }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

const authorizer = new RequestAuthorizer();
CustomApp.getInitialProps = async (
  appContext: AppContext
): Promise<CustomAppProps> => {
  const {
    ctx: { req, res, asPath },
    router,
  } = appContext;
  const appProps = await App.getInitialProps(appContext);

  const command: RequestAuthorizerCommand = {
    path: asPath ?? '/',
    cookieHeader: req?.headers.cookie,
    serverSide: req !== undefined && res !== undefined,
  };

  const response = authorizer.execute(command);

  if (response.success) {
    return {
      ...appProps,
      accessDenied: false,
      user: response.user,
    };
  }

  if (response.error == AuthenticationError.InvalidToken) {
    const redirect = encodeURIComponent(command.path || '/');
    const url = `/login?redirect=${redirect}`;

    if (res) {
      res.writeHead(302, { Location: url });
      res.end();
    } else {
      router.replace(url);
    }
  }

  return { ...appProps, accessDenied: true };
};

export default CustomApp;
