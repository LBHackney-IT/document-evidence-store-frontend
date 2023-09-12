import { render } from '@testing-library/react';
import { NextPage } from 'next';
import NextApp from 'next/app';
import React from 'react';
import { mocked } from 'ts-jest/utils';
import App from './_app';
import { Router } from 'next/router';

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

const pageProps = {
  pageProps: {
    json: {},
  },
};

MockedNextApp.getInitialProps.mockImplementation(async () => pageProps);

describe('CustomApp', () => {
  const pageComponent = (jest.fn(() => <p>Hello</p>) as unknown) as NextPage;

  it('renders the component with the right props', () => {
    render(
      <App
        Component={pageComponent}
        pageProps={pageProps}
        router={{} as Router}
      />
    );
    expect(pageComponent).toHaveBeenCalledWith(pageProps, {});
  });
});
