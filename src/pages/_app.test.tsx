import { render, screen } from '@testing-library/react';
import App, { getServerSideProps } from './_app';
import { createRouter } from 'next/router';
import { AppProps } from 'next/app';
import React, { createElement } from 'react';
import { PageComponent } from '../../types/page-component';
import { authoriseUser } from '../helpers/auth';
import { mocked } from 'ts-jest/utils';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

jest.mock('../helpers/auth');

const mockedAuthoriseUser = mocked(authoriseUser);

describe('CustomApp', () => {
  const pageComponent = (jest.fn(() => (
    <p>Hello</p>
  )) as unknown) as PageComponent;
  const pageProps = { foo: 'bar' };

  it('if the page is public returns the component with the right props', () => {
    render(<App Component={pageComponent} pageProps={pageProps} />);
    expect(pageComponent).toHaveBeenCalledWith(pageProps, {});
  });

  describe('getServerSideProps', () => {
    it('when the user is not logged in redirects to google', async () => {
      const req = { url: '/path' } as IncomingMessage;
      const res = {} as ServerResponse;
      const ctx = { req, res } as GetServerSidePropsContext;

      mockedAuthoriseUser.mockImplementation(() => undefined);

      const result = await getServerSideProps(ctx);

      expect(result).toHaveProperty('redirect', {
        destination:
          'https://auth.hackney.gov.uk/auth?redirect_uri=http://localdev.hackney.gov.uk/path',
        permanent: false,
      });
    });
  });
});
