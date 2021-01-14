import { useState, useEffect, useMemo } from 'react';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../../../components/ResidentLayout';
import { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import UploaderForm from '../../../components/UploaderForm';
import { EvidenceRequest } from '../../../domain/evidence-request';
import { InternalApiGateway } from '../../../gateways/internal-api';
import { DocumentSubmission } from 'src/domain/document-submission';

const Index = (): ReactNode => {
  const router = useRouter();
  const gateway = new InternalApiGateway();
  const { requestId } = router.query as { requestId: string };
  const [evidenceRequest, setEvidenceRequest] = useState<EvidenceRequest>();
  const [documentSubmissions, setDocumentSubmissions] = useState<
    DocumentSubmission[]
  >([]);

  useEffect(() => {
    gateway
      .getEvidenceRequest(requestId)
      .then((request) => setEvidenceRequest(request));
  }, []);

  useEffect(() => {
    if (!evidenceRequest) return;

    evidenceRequest.documentTypes.forEach(({ id }) => {
      gateway
        .createDocumentSubmission(id)
        .then((ds) => setDocumentSubmissions([...documentSubmissions, ds]));
    });
  }, [evidenceRequest]);

  const loading = useMemo(
    () => documentSubmissions.length !== evidenceRequest?.documentTypes.length,
    [evidenceRequest, documentSubmissions]
  );

  return (
    <Layout>
      <Head>
        <title>Upload your documents</title>
      </Head>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Heading level={HeadingLevels.H1}>Upload your documents</Heading>
          <p className="lbh-body">
            Upload a photograph or scan for the following evidence.
          </p>
          {loading ? (
            <p className="lbh-body">Loading...</p>
          ) : (
            <UploaderForm
              submissions={documentSubmissions}
              requestId={requestId as string}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
