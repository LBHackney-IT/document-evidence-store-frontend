import { NextPage } from 'next';
import App, { AppContext, AppProps } from 'next/app';
import React from 'react';
import { User } from 'src/domain/user';
import { AccessDeniedPage } from '../components/AccessDeniedPage';
import { UserContext } from '../contexts/UserContext';
import {
  RequestAuthorizer,
  RequestAuthorizerCommand,
} from '../services/request-authorizer';
import '../styles/globals.scss';

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

  const { redirect } = response;
  if (res) {
    res.writeHead(302, { Location: redirect });
    res.end();
  } else {
    router.replace(redirect);
  }

  return { ...appProps, accessDenied: true };
};

export default CustomApp;
