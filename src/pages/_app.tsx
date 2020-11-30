import '../styles/globals.css';
import App, { AppContext, AppProps } from 'next/app';
import React from 'react';
import { PageComponent } from '../../types/page-component';
import {
  authoriseUser,
  createLoginUrl,
  pathIsWhitelisted,
  redirect,
  User,
  userIsInValidGroup,
} from '../helpers/auth';
import UserContext from '../components/UserContext/UserContext';

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
    ctx: { req, res, pathname },
  } = appContext;
  const appProps = await App.getInitialProps(appContext);

  if (pathIsWhitelisted(pathname)) return appProps;

  if (!req || !res) {
    redirect(res, pathname);
    return { ...appProps, reloading: true };
  }

  const user = authoriseUser(req);

  if (!user) {
    const authPath = createLoginUrl(pathname);
    return redirect(res, authPath);
  }

  if (!userIsInValidGroup(user)) {
    return redirect(res, '/access-denied');
  }

  return { ...appProps, user };
};

export default CustomApp;
