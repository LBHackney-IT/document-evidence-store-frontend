import '../styles/globals.scss';
import App, { AppContext, AppProps } from 'next/app';
import React from 'react';
import {
  authoriseUser,
  pathIsWhitelisted,
  serverSideRedirect,
  unsafeExtractUser,
  User,
  userIsInValidGroup,
} from '../helpers/auth';
import { UserContext } from '../contexts/UserContext';
import { NextPage } from 'next';
import { Layout } from '../components/Layout';
import { AccessDeniedPage } from '../components/AccessDeniedPage';

type CustomAppProps = {
  Component: NextPage;
  pageProps: AppProps['pageProps'];
  user?: User;
  accessDenied?: boolean;
};

const CustomApp = ({
  Component,
  pageProps,
  user,
  accessDenied,
}: CustomAppProps): JSX.Element | null => {
  if (accessDenied) return <AccessDeniedPage />;

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
    ctx: { req, res, pathname, asPath },
  } = appContext;
  const appProps = await App.getInitialProps(appContext);
  const currentPath = asPath || '/';

  const user = req && res ? authoriseUser(req) : unsafeExtractUser();
  const props = { ...appProps, user };

  if (pathIsWhitelisted(pathname)) return props;

  if (!user) {
    const redirect = encodeURIComponent(asPath || '/');
    const url = `/login?redirect=${redirect}`;

    if (req && res) {
      serverSideRedirect(res, url);
    } else {
      window.location.replace(url);
    }

    return { accessDenied: true };
  }

  if (!userIsInValidGroup(user)) {
    return { accessDenied: true };
  }

  return props;
};

export default CustomApp;
