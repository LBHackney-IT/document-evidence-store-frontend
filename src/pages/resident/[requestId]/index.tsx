import Layout from '../../../components/ResidentLayout';
import InterruptionCard from '../../../components/InterruptionCard';
import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Index = (): ReactNode => {
  const router = useRouter();
  const { requestId } = router.query;

  return (
    <Layout feedbackUrl={process.env.FEEDBACK_FORM_RESIDENT_URL as string}>
      <Head>
        <title>You’ll need to photograph your documents</title>
      </Head>
      <InterruptionCard image="/illustration.svg">
        <h1 className="lbh-heading-h1">
          You’ll need to photograph your documents
        </h1>
        <p className="lbh-body">You can use your smartphone camera.</p>
        <p className="lbh-body">First, make sure you’re in a well-lit place.</p>
        <p className="lbh-body">
          Lie the document flat and try not to cover any part of it.
        </p>
        <p className="lbh-body">
          Make sure the whole document is in the frame.
        </p>
        <Link href={`/resident/${requestId}/upload`}>
          <a className="govuk-button lbh-button">Continue</a>
        </Link>
      </InterruptionCard>
    </Layout>
  );
};

export default Index;
