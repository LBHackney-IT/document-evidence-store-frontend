import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { DocumentType } from '../../../domain/document-type';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import Layout from '../../../components/ResidentLayout';
import UploaderForm from '../../../components/UploaderForm';
import { Constants } from '../../../helpers/Constants';
import FileFormatDetails from 'src/components/FileFormatsDetails';
import PhotoInformation from 'src/components/PhotoInformation';

type UploadProps = {
  requestId: string;
  evidenceRequestId: string;
  documentTypes: DocumentType[];
  feedbackUrl: string;
};

const Upload: NextPage<UploadProps> = ({
  requestId,
  evidenceRequestId,
  documentTypes,
  feedbackUrl,
}) => {
  const router = useRouter();
  const onSuccess = useCallback(() => {
    router.push(`/resident/${requestId}/confirmation`);
  }, []);

  return (
    <Layout feedbackUrl={feedbackUrl}>
      <Head>
        <title>
          Upload your documents | Document Evidence Service | Hackney Council
        </title>
      </Head>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="lbh-heading-h1">Upload your documents</h1>
          <p className="lbh-body">
            Before you start, make sure that all the files you need are stored
            on this device.
          </p>
          <p className="govuk-body govuk-!-font-weight-bold">
            You can provide evidence by:
          </p>
          <ul className="lbh-list lbh-list--bullet govuk-!-margin-top-2">
            <li>Photographing your documents</li>
            <li>Scanning your documents</li>
            <li>Uploading existing evidence</li>
          </ul>
          <PhotoInformation />
          <FileFormatDetails />
          <div
            className="govuk-inset-text"
            data-testid="select-multiple-files-guidance"
          >
            After clicking the &quot;Choose files&quot; button, you can use the
            Ctrl key (Command key on a Mac machine) + click to select multiple
            files.
          </div>
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
  const evidenceRequest = await gateway.getEvidenceRequest(
    Constants.DUMMY_EMAIL,
    requestId
  );
  const evidenceRequestId = evidenceRequest.id;
  const documentTypes = evidenceRequest.documentTypes;
  const feedbackUrl = process.env.FEEDBACK_FORM_RESIDENT_URL as string;

  return {
    props: { requestId, evidenceRequestId, documentTypes, feedbackUrl },
  };
};

export default Upload;
