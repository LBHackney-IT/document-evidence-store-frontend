import { Button } from 'lbh-frontend-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import AcceptDialog from 'src/components/AcceptDialog';
import Layout from 'src/components/DashboardLayout';
import History from 'src/components/History';
import RejectDialog from 'src/components/RejectDialog';
import { humanFileSize } from 'src/helpers/formatters';
import styles from 'src/styles/Document.module.scss';

const DocumentDetailPage = (): ReactNode => {
  const router = useRouter();
  const { residentId, documentId, action } = router.query;

  return (
    <Layout>
      <Head>
        <title>Passport | Firstname Surname</title>
      </Head>

      <h1 className="lbh-heading-h2">
        <Link href={`/dashboard/resident/${residentId}`}>
          <a className="lbh-link">Firstname Surname</a>
        </Link>
        <img src="/divider.svg" alt="" className="lbu-divider" />
        Passport
      </h1>

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

      <h2 className="lbh-heading-h3">Preview</h2>

      <figure className={styles.preview}>
        <img src="http://placehold.it/600x400" alt="example" />
        <figcaption className="lbh-body-s">
          <strong>PDF</strong> {humanFileSize(2500000)}{' '}
          <a href="#" className="lbh-link">
            Download
          </a>
        </figcaption>
      </figure>

      <h2 className="lbh-heading-h3">History</h2>

      <History />

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
