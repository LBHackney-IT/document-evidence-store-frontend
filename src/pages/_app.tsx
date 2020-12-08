import '../styles/globals.scss';
import App, { AppContext, AppProps } from 'next/app';
import React from 'react';
import { PageComponent } from '../../types/page-component';
import {
  authoriseUser,
  pathIsWhitelisted,
  serverSideRedirect,
  User,
  userIsInValidGroup,
} from '../helpers/auth';
import { UserContext } from '../components/UserContext/UserContext';

type CustomAppProps = {
  Component: PageComponent;
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
      <Component {...pageProps} />;
    </UserContext.Provider>
  );
};

CustomApp.getInitialProps = async (appContext: AppContext) => {
  const {
    ctx: { req, res, pathname, asPath },
  } = appContext;
  const appProps = await App.getInitialProps(appContext);
  const currentPath = asPath || '/';

  if (pathIsWhitelisted(pathname)) return appProps;

  if (!req || !res) {
    window.location.replace(currentPath);
    return { ...appProps, reloading: true };
  }

  const user = authoriseUser(req);
  if (!user) {
    return serverSideRedirect(res, `/login?redirect=${currentPath}`);
  }

  if (!userIsInValidGroup(user)) {
    return serverSideRedirect(res, '/access-denied');
  }

  return { ...appProps, user };
};

export default CustomApp;
