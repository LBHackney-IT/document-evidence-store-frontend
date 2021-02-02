import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { ResponseMapper } from 'src/boundary/response-mapper';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { DocumentSubmissionResponse } from 'types/api';
import Layout from '../../../components/ResidentLayout';
import UploaderForm from '../../../components/UploaderForm';

type UploadProps = {
  documentSubmissionsResponse: DocumentSubmissionResponse[];
  requestId: string;
};

const Upload: NextPage<UploadProps> = ({
  documentSubmissionsResponse,
  requestId,
}) => {
  const router = useRouter();
  const documentSubmissions = documentSubmissionsResponse.map(
    ResponseMapper.mapDocumentSubmission
  );

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

  const documentSubmissionsResponse = await Promise.all(requests);

  return {
    props: { requestId, documentSubmissionsResponse },
  };
};

export default Upload;
