import {
  Container,
  Header,
  Heading,
  HeadingLevels,
  Main,
  PhaseBanner,
  Tile,
} from 'lbh-frontend-react';
import Layout from '../components/Layout';
import { ReactNode } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import fetch from 'isomorphic-unfetch';

const SendARequest = (): ReactNode => (
  <Layout>
    <Heading level={HeadingLevels.H1}>Send a request</Heading>
  </Layout>
);

export default SendARequest;
