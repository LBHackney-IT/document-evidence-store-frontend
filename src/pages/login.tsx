import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/ResidentLayout';
import Link from 'next/link';

const baseUrl = process.env.RUNTIME_APP_URL as string;

const createLoginUrl = (redirect: string): string => {
  return `https://auth.hackney.gov.uk/auth?redirect_uri=${baseUrl}${redirect}`;
};

const Home = (): ReactNode => {
  const router = useRouter();
  const loginUrl = useMemo(() => {
    let { redirect } = router.query as { redirect?: string };
    if (!redirect || redirect == '/') redirect = '/dashboard';
    return createLoginUrl(redirect);
  }, [router]);

  return (
    <Layout>
      <Heading level={HeadingLevels.H1}>Staff login</Heading>

      <Link href={loginUrl}>
        <a className="govuk-button lbh-button lbh-button--start govuk-button--start">
          Log in with Google{' '}
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

export default Home;
