import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'src/components/DashboardLayout';
import { DocumentType } from '../../../../../../../domain/document-type';
import { withAuth, WithUser } from 'src/helpers/authed-server-side-props';
import StaffUploaderForm from 'src/components/StaffUploaderForm';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

type UploadPageProps = {
  teamId: string;
  residentId: string;
  feedbackUrl: string;
  staffSelectedDocumentTypes: DocumentType[];
};

const UploadPage: NextPage<WithUser<UploadPageProps>> = ({
  teamId,
  residentId,
  feedbackUrl,
  staffSelectedDocumentTypes,
}) => {
  const router = useRouter();
  const onSuccess = useCallback(() => {
    router.push(`teams/${teamId}/dashboard/residents/${residentId}`);
  }, []);
  return (
    <Layout teamId={teamId} feedbackUrl={feedbackUrl}>
      <Head>
        <title>Upload | Document Evidence Service | Hackney Council</title>
      </Head>
      <h1 data-testid="upload-documents-h1" className="lbh-heading-h2">
        Upload documents
      </h1>
      <StaffUploaderForm // need to create a new component similar to this one that accepts the correct arguments for ds
        residentId={residentId}
        staffSelectedDocumentTypes={staffSelectedDocumentTypes}
        onSuccess={onSuccess}
      />
      <button
        className="govuk-button lbh-button"
        onClick={() => {
          alert('Click!');
        }}
      >
        Submit
      </button>
    </Layout>
  );
};

export const getServerSideProps = withAuth<UploadPageProps>(async (ctx) => {
  const { teamId, residentId } = ctx.query as {
    teamId: string;
    residentId: string;
  };
  const feedbackUrl = process.env.FEEDBACK_FORM_STAFF_URL as string;
  const staffSelectedDocumentTypes: DocumentType[] = [
    {
      id: 'passport-scan',
      title: 'Passport Scan',
      description: 'A valid passport open at the photo page',
      enabled: true,
    },
  ];
  return {
    props: { teamId, residentId, feedbackUrl, staffSelectedDocumentTypes },
  };
});

export default UploadPage;
