import { AppProps } from 'next/app';
import React from 'react';
import { UserContext } from 'src/contexts/UserContext';
import '../helpers/register-domain';
import '../styles/globals.scss';

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element | null => {
  return (
    <UserContext.Provider value={{ user: pageProps.json?.user }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default CustomApp;
