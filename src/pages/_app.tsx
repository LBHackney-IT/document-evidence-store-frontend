import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ReactNode } from 'react';

const CustomApp = ({ Component, pageProps }: AppProps): ReactNode => {
  return <Component {...pageProps} />;
};

export default CustomApp;
