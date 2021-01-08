import Head from 'next/head';
import { Heading, HeadingLevels, Button } from 'lbh-frontend-react';
import { ReactNode } from 'react';
import Layout from 'src/components/DashboardLayout';
import { useRouter } from 'next/router';
import { EvidenceList, EvidenceTile } from 'src/components/EvidenceTile';
import styles from 'src/styles/Resident.module.scss';

const ResidentPage = (): ReactNode => {
  const router = useRouter();
  const { residentId } = router.query as { residentId: string };

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
          residentId={residentId}
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize={1300000}
          format="PDF"
          purpose="Example form"
          toReview
        />
        <EvidenceTile
          residentId={residentId}
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize={1300000}
          format="PDF"
          purpose="Example form"
          toReview
        />
        <EvidenceTile
          residentId={residentId}
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize={1300000}
          format="PDF"
          purpose="Example form"
          toReview
        />
      </EvidenceList>
      <Heading level={HeadingLevels.H3}>Pending requests</Heading>

      <table className={`govuk-table lbh-table ${styles.table}`}>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              Document
            </th>
            <th scope="col" className="govuk-table__header">
              Requested
            </th>
            <th scope="col" className="govuk-table__header">
              <span className="lbu-visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Passport</td>
            <td className="govuk-table__cell">1 day ago</td>
            <td className="govuk-table__cell  govuk-table__cell--numeric">
              <Button className={styles.button}>Remind</Button>
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Proof of address</td>
            <td className="govuk-table__cell">1 day ago</td>
            <td className="govuk-table__cell  govuk-table__cell--numeric">
              <Button className={styles.button}>Remind</Button>
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Proof of benefit entitlement</td>
            <td className="govuk-table__cell">2 days ago</td>
            <td className="govuk-table__cell  govuk-table__cell--numeric">
              <Button className={styles.button}>Remind</Button>
            </td>
          </tr>
        </tbody>
      </table>

      <Heading level={HeadingLevels.H3}>Reviewed</Heading>

      <EvidenceList twoColumns>
        <EvidenceTile
          residentId={residentId as string}
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize={1300000}
          format="PDF"
          purpose="Example form"
        />
        <EvidenceTile
          residentId={residentId}
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize={1300000}
          format="PDF"
          purpose="Example form"
        />
        <EvidenceTile
          residentId={residentId}
          id="123"
          title="Foo"
          createdAt="1 day ago"
          fileSize={1300000}
          format="PDF"
          purpose="Example form"
        />
      </EvidenceList>
    </Layout>
  );
};

export default ResidentPage;
