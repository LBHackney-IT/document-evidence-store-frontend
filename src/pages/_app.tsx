import '../styles/globals.scss';
import App, { AppContext, AppProps } from 'next/app';
import React from 'react';
import {
  authoriseUser,
  pathIsWhitelisted,
  serverSideRedirect,
  User,
  userIsInValidGroup,
} from '../helpers/auth';
import { UserContext } from '../components/UserContext/UserContext';
import { NextPage } from 'next';
import { Layout } from '../components/Layout';

type CustomAppProps = {
  Component: NextPage;
  pageProps: AppProps['pageProps'];
  user?: User;
  reloading?: boolean;
};

const CustomApp = ({
  Component,
  pageProps,
  user,
  reloading,
}: CustomAppProps): JSX.Element | null => {
  if (reloading) return null;

  return (
    <UserContext.Provider value={{ user }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
};

CustomApp.getInitialProps = async (appContext: AppContext) => {
  const {
    ctx: { req, res, pathname },
  } = appContext;
  const appProps = await App.getInitialProps(appContext);

  if (pathIsWhitelisted(pathname)) return appProps;

  if (!req || !res) {
    window.location.replace(pathname);
    return { ...appProps, reloading: true };
  }

  const user = authoriseUser(req);
  if (!user) {
    return serverSideRedirect(res, `/login?redirect=${pathname}`);
  }

  if (!userIsInValidGroup(user)) {
    return serverSideRedirect(res, '/access-denied');
  }

  return { ...appProps, user };
};

export default CustomApp;
