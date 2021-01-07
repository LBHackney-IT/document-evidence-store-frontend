import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { ReactNode } from 'react';
import Layout from 'src/components/DashboardLayout';
// import { useRouter } from 'next/router';
import { EvidenceList, EvidenceTile } from 'src/components/EvidenceTile';

const ResidentPage = (): ReactNode => {
  // const router = useRouter();
  // const { residentId } = router.query;

  return (
    <Layout>
      <Head>
        <title>Firstname Surname</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Firstname Surname</Heading>
      <p className="lbh-body">0777 777 7777</p>
      <p className="lbh-body">email@email.com</p>
      <Heading level={HeadingLevels.H3}>To review</Heading>
      <EvidenceList>
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize="1.3MB"
          format="PDF"
          purpose="Example form"
          toReview
        />
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize="1.3MB"
          format="PDF"
          purpose="Example form"
          toReview
        />
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize="1.3MB"
          format="PDF"
          purpose="Example form"
          toReview
        />
      </EvidenceList>
      <Heading level={HeadingLevels.H3}>Pending requests</Heading>
      <Heading level={HeadingLevels.H3}>Reviewed</Heading>

      <EvidenceList twoColumns>
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize="1.3MB"
          format="PDF"
          purpose="Example form"
        />
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize="1.3MB"
          format="PDF"
          purpose="Example form"
        />
        <EvidenceTile
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize="1.3MB"
          format="PDF"
          purpose="Example form"
        />
      </EvidenceList>
    </Layout>
  );
};

export default ResidentPage;
