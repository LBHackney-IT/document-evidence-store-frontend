import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { DocumentSubmission } from 'src/domain/document-submission';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import Layout from '../../../components/ResidentLayout';
import UploaderForm from '../../../components/UploaderForm';

type UploadProps = {
  documentSubmissions: DocumentSubmission[];
  requestId: string;
};

const Upload: NextPage<UploadProps> = ({ documentSubmissions, requestId }) => {
  const router = useRouter();
  const onSuccess = useCallback(() => {
    router.push(`/resident/${requestId}/confirmation`);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Upload your documents</title>
      </Head>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Heading level={HeadingLevels.H1}>
            Upload your{' '}
            {documentSubmissions?.length > 1 ? 'documents' : 'document'}
          </Heading>
          <p className="lbh-body">
            Upload a photograph or scan for the following evidence.
          </p>
          <UploaderForm
            submissions={documentSubmissions}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<
  UploadProps,
  { requestId: string }
> = async (ctx) => {
  const requestId = ctx.params?.requestId;
  if (!requestId) return { notFound: true };

  const gateway = new EvidenceApiGateway();
  const evidenceRequest = await gateway.getEvidenceRequest(requestId);

  const requests = evidenceRequest.documentTypes.map(({ id }) =>
    gateway.createDocumentSubmission(evidenceRequest.id, id)
  );

  const documentSubmissions = await Promise.all(requests);

  return {
    props: { requestId, documentSubmissions },
  };
};

export default Upload;
