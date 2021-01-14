import Head from 'next/head';
import { Button, Heading, HeadingLevels } from 'lbh-frontend-react';
import { ReactNode } from 'react';
import Layout from 'src/components/DashboardLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { humanFileSize } from 'src/helpers/formatters';
import AcceptDialog from 'src/components/AcceptDialog';
import RejectDialog from 'src/components/RejectDialog';
import styles from 'src/styles/Document.module.scss';

const DocumentDetailPage = (): ReactNode => {
  const router = useRouter();
  const { residentId, documentId, action } = router.query;

  return (
    <Layout>
      <Head>
        <title>Passport | Firstname Surname</title>
      </Head>

      <Heading level={HeadingLevels.H2}>
        <Link href={`/dashboard/resident/${residentId}`}>
          <a className="lbh-link">Firstname Surname</a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        Passport
      </Heading>

      <div className={styles.actions}>
        <Link
          href={`/dashboard/resident/${residentId}/document/${documentId}?action=accept`}
          scroll={false}
        >
          <Button>Accept</Button>
        </Link>
        <Link
          href={`/dashboard/resident/${residentId}/document/${documentId}?action=reject`}
          scroll={false}
        >
          <Button className="govuk-button--secondary lbh-button--secondary">
            Request new file
          </Button>
        </Link>
      </div>

      <Heading level={HeadingLevels.H3}>Preview</Heading>

      <figure className={styles.preview}>
        <img src="http://placehold.it/600x400" alt="example" />
        <figcaption className="lbh-body-s">
          <strong>PDF</strong> {humanFileSize(2500000)}{' '}
          <a href="#" className="lbh-link">
            Download
          </a>
        </figcaption>
      </figure>

      <Heading level={HeadingLevels.H3}>History</Heading>

      <table className="govuk-table lbh-table">
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              <strong>Namey McName</strong> accepted this file
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              1 hour ago
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              <strong>Firstname Surname</strong> uploaded a new file
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              2 hours ago
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Reminder sent</td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              1 week ago
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">Reminder sent</td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              2 weeks ago
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              <strong>Namey McName</strong> requested a new file with the
              reason:
              <p>"The image is too dark to see clearly"</p>
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              3 weeks ago
            </td>
          </tr>
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              <strong>Firstname Surname</strong> uploaded this file
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              3 weeks ago
            </td>
          </tr>
        </tbody>
      </table>

      <AcceptDialog
        open={action === 'accept'}
        onAccept={() => {
          // handle accept here
        }}
        onDismiss={() =>
          router.push(
            `/dashboard/resident/${residentId}/document/${documentId}`
          )
        }
      />

      <RejectDialog
        open={action === 'reject'}
        onReject={() => {
          // handle reject here
        }}
        onDismiss={() =>
          router.push(
            `/dashboard/resident/${residentId}/document/${documentId}`
          )
        }
      />
    </Layout>
  );
};

export default DocumentDetailPage;