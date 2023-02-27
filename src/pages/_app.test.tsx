import { render } from '@testing-library/react';
import { NextPage } from 'next';
import NextApp, { AppInitialProps, AppProps } from 'next/app';
import React from 'react';
import { mocked } from 'ts-jest/utils';
import App from './_app';

jest.mock('../services/request-authorizer');
jest.mock('next/app');
jest.mock('next/router', () => {
  return {
    useRouter: () => {
      return {
        events: {
          on: jest.fn(),
          off: jest.fn(),
        },
      };
    },
  };
});

const MockedNextApp = mocked(NextApp);
const pageProps = ({ foo: 'bar' } as unknown) as AppInitialProps;
MockedNextApp.getInitialProps.mockImplementation(async () => pageProps);

describe('CustomApp', () => {
  const pageComponent = (jest.fn(() => <p>Hello</p>) as unknown) as NextPage;
  const appProps = { Component: pageComponent, pageProps } as AppProps<any>;

  it('renders the component with the right props', () => {
    render(<App {...appProps} />);
    expect(pageComponent).toHaveBeenCalledWith(pageProps, {});
  });
});
