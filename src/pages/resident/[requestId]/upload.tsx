import { useState, useEffect } from 'react';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import Layout from '../../../components/ResidentLayout';
import { ReactNode } from 'react';
import Head from 'next/head';
import UploaderForm from '../../../components/UploaderForm';
import { DocumentType } from '../../../domain/document-type';
import { EvidenceRequest } from '../../../domain/evidence-request';
import { InternalApiGateway } from '../../../gateways/internal-api';

const Index = (): ReactNode => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>();
  const [evidenceRequest, setEvidenceRequest] = useState<EvidenceRequest>();

  useEffect(() => {
    const gateway = new InternalApiGateway();
    gateway.getDocumentTypes().then(setDocumentTypes);
    gateway.getEvidenceRequest().then(setEvidenceRequest);
  }, []);

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
          {documentTypes && evidenceRequest ? (
            <UploaderForm
              documentTypes={documentTypes}
              evidenceRequest={evidenceRequest}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
