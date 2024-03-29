import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import Layout from '../components/ResidentLayout';

type LoginProps = { appUrl: string; feedbackUrl: string };

const Home: NextPage<LoginProps> = ({ appUrl, feedbackUrl }) => {
  const router = useRouter();
  const loginUrl = useMemo(() => {
    let { redirect } = router.query as { redirect?: string };
    if (!redirect || redirect == '/') redirect = '/teams';
    return `https://auth.hackney.gov.uk/auth?redirect_uri=${appUrl}${redirect}`;
  }, [router, appUrl]);

  return (
    <Layout feedbackUrl={feedbackUrl}>
      <Head>
        <title>Login | Document Evidence Service | Hackney Council</title>
      </Head>
      <h1 className="lbh-heading-h1">Staff sign in</h1>

      <Link href={loginUrl}>
        <a className="govuk-button lbh-button lbh-button--start govuk-button--start">
          Sign in with Google{' '}
          <svg
            className="govuk-button__start-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="17.5"
            height="19"
            viewBox="0 0 33 40"
            role="presentation"
            focusable="false"
          >
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </a>
      </Link>

      <p className="lbh-body">
        If you think you should be able to access this but can’t, contact
        Hackney IT.
      </p>
      <p className="lbh-body">
        If you’re trying to upload a document, follow the link you were sent.
      </p>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<LoginProps> = async () => {
  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error('Missing APP_URL');
  const feedbackUrl = process.env.FEEDBACK_FORM_RESIDENT_URL as string;

  return { props: { appUrl, feedbackUrl } };
};

export default Home;
