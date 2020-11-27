import '../styles/globals.css';
import { AppProps } from 'next/app';
import React, { ReactNode } from 'react';
import { PageComponent } from '../../types/page-component';
import { GetServerSideProps } from 'next';
import { authoriseUser, redirectToLogin, User } from '../helpers/auth';
import { useRouter } from 'next/router';

type CustomAppProps = {
  Component: PageComponent;
  pageProps: AppProps['pageProps'];
};

const baseUrl = process.env.BASE_URL!;
const loginUrl = (redirect: string) =>
  `https://auth.hackney.gov.uk/auth?redirect_uri=${baseUrl}${redirect}`;

const CustomApp = ({ Component, pageProps }: CustomAppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const user = authoriseUser({ req, res });

  if (!user) {
    const path = req.url || '/';
    return {
      props: {},
      redirect: { destination: loginUrl(path), permanent: false },
    };
  }

  return { props: {} };
};

export default CustomApp;
