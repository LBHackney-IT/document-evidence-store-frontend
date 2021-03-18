import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { DocumentType } from '../../../domain/document-type';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import Layout from '../../../components/ResidentLayout';
import UploaderForm from '../../../components/UploaderForm';

type UploadProps = {
  requestId: string;
  evidenceRequestId: string;
  documentTypes: DocumentType[];
};

const Upload: NextPage<UploadProps> = ({
  requestId,
  evidenceRequestId,
  documentTypes,
}) => {
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
            Upload your {documentTypes?.length > 1 ? 'documents' : 'document'}
          </Heading>
          <p className="lbh-body">
            Upload a photograph or scan for the following evidence.
          </p>
          <UploaderForm
            evidenceRequestId={evidenceRequestId}
            documentTypes={documentTypes}
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
  const evidenceRequestId = evidenceRequest.id;
  const documentTypes = evidenceRequest.documentTypes;

  return {
    props: { requestId, evidenceRequestId, documentTypes },
  };
};

export default Upload;
