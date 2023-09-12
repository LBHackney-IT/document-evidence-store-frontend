import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { UserContext } from 'src/contexts/UserContext';
import { registerDomainModels } from '../helpers/register-domain';
import '../styles/globals.scss';
import * as gtag from '../ga/gtag';
import { User } from '../../src/domain/user';

registerDomainModels();

interface CustomAppProps {
  json: {
    user?: User;
  };
}

const CustomApp = (props: AppProps): JSX.Element | null => {
  const { Component } = props;
  const pageProps = props.pageProps as CustomAppProps;

  const router = useRouter();

  const handleRouteChange = (url: URL) => {
    gtag.pageview(url);
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const value = { user: pageProps.json?.user };

  return (
    <UserContext.Provider value={value}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default CustomApp;
