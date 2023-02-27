import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { UserContext } from 'src/contexts/UserContext';
import { registerDomainModels } from '../helpers/register-domain';
import '../styles/globals.scss';
import * as gtag from '../ga/gtag';

registerDomainModels();

const CustomApp = ({
  Component,
  pageProps,
}: AppProps<any>): JSX.Element | null => {
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
  return (
    <UserContext.Provider value={{ user: pageProps.json?.user }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default CustomApp;
