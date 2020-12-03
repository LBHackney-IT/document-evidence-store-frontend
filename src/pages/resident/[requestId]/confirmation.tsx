import { Heading, HeadingLevels, Tile } from 'lbh-frontend-react';
import Layout from '../../../components/ResidentLayout';
import Panel from '../../../components/Panel';
import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Index = (): ReactNode => {
  const router = useRouter();
  const { requestId } = router.query;

  return (
    <Layout>
      <Head>
        <title>Confirmation</title>
      </Head>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Panel>
            <Heading level={HeadingLevels.H1}>
              We've recieved your documents
            </Heading>
            <p className="lbh-body">Your reference number: {requestId}</p>
          </Panel>

          <p className="lbh-body">We have sent you a confirmation email.</p>

          <Heading level={HeadingLevels.H2}>What happens next</Heading>
          <p className="lbh-body">
            We’ve sent your evidence to the service that requested it. They will
            be in touch about the next steps.
          </p>
          <p className="lbh-body">
            <a
              href={process.env.FEEDBACK_FORM_URL}
              className="govuk-link lbh-link"
            >
              What did you think of this service?
            </a>
            (takes 30 seconds)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
