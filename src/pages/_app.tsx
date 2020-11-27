import '../styles/globals.css';
import { AppProps } from 'next/app';
import React from 'react';
import { PageComponent } from '../../types/page-component';
import { GetServerSideProps } from 'next';
import {
  authoriseUser,
  createLoginUrl,
  pathIsWhitelisted,
  User,
  userIsInValidGroup,
} from '../helpers/auth';

type CustomAppProps = {
  Component: PageComponent;
  pageProps: AppProps['pageProps'];
  user?: User;
};

const CustomApp = ({ Component, pageProps }: CustomAppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = authoriseUser(req);
  if (pathIsWhitelisted(req.url || '/')) return { props: { user } };

  if (!user) {
    const path = req.url || '/';
    return {
      props: {},
      redirect: { destination: createLoginUrl(path), permanent: false },
    };
  }

  if (!userIsInValidGroup(user)) {
    return {
      props: {},
      redirect: { destination: '/access-denied', permanent: false },
    };
  }

  return { props: { user } };
};

export default CustomApp;
