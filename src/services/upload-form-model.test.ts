import { FormValues, UploadFormModel } from './upload-form-model';
import documentSubmissionFixture from '../../cypress/fixtures/document_submissions/index.json';
import evidenceRequestFixture from '../../cypress/fixtures/evidence_requests/index.json';
import { ResponseMapper } from '../boundary/response-mapper';
import { Constants } from 'src/helpers/Constants';
import { DocumentSubmissionRequest } from 'src/gateways/internal-api';
import * as S3Gateway from '../gateways/s3-gateway';
import * as MockS3Gateway from '../gateways/__mocks__/s3-gateway';

const documentSubmission = documentSubmissionFixture.map((ds) =>
  ResponseMapper.mapDocumentSubmission(ds)
)[0];
const documentTypes = documentSubmissionFixture.map(
  (ds) => ResponseMapper.mapDocumentSubmission(ds).documentType
);
const evidenceRequest = ResponseMapper.mapEvidenceRequest(
  evidenceRequestFixture[0]
);
const evidenceRequestId = evidenceRequest.id;

const mockCreateDocumentSubmission = jest.fn(() => documentSubmission);
const mockSendUploadConfirmationNotificationToResident = jest.fn();
jest.mock('../gateways/internal-api', () => ({
  InternalApiGateway: jest.fn(() => ({
    createDocumentSubmission: mockCreateDocumentSubmission,
    sendUploadConfirmationNotificationToResident: mockSendUploadConfirmationNotificationToResident,
  })),
}));

const { uploadMock } = S3Gateway as typeof MockS3Gateway;
jest.mock('../gateways/s3-gateway');

describe('UploadFormModel', () => {
  let model: UploadFormModel;

  beforeEach(() => {
    model = new UploadFormModel(documentTypes);
  });

  describe('initialValues', () => {
    it('has the correct IDs', () => {
      const values = model.initialValues;
      expect(values).toMatchObject({
        [documentTypes[0].id]: null,
        [documentTypes[1].id]: null,
      });
    });
  });

  describe('handleSubmit', () => {
    const fileList1 = [new File(['foo'], 'foo.txt')];
    const fileList2 = [
      new File(['bar'], 'bar.png'),
      new File(['baz'], 'baz.png'),
    ];

    const values: FormValues = {
      [documentTypes[0].id]: fileList1,
      [documentTypes[1].id]: fileList2,
    };

    const firstDocumentSubmissionRequest: DocumentSubmissionRequest = {
      documentType: documentTypes[0].id,
    };

    const secondDocumentSubmissionRequest: DocumentSubmissionRequest = {
      documentType: documentTypes[1].id,
    };

    const thirdDocumentSubmissionRequest: DocumentSubmissionRequest = {
      documentType: documentTypes[1].id,
    };

    it('creates document submission for each file', async () => {
      await model.handleSubmit(values, evidenceRequestId);

      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        1,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        firstDocumentSubmissionRequest
      );
      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        2,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        secondDocumentSubmissionRequest
      );
      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        3,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        thirdDocumentSubmissionRequest
      );
    });

    it('calls s3 for each submission', async () => {
      await model.handleSubmit(values, evidenceRequestId);

      expect(uploadMock).toHaveBeenNthCalledWith(
        1,
        fileList1[0],
        documentSubmission.uploadPolicy
      );
      expect(uploadMock).toHaveBeenNthCalledWith(
        2,
        fileList2[0],
        documentSubmission.uploadPolicy
      );
      expect(uploadMock).toHaveBeenNthCalledWith(
        3,
        fileList2[1],
        documentSubmission.uploadPolicy
      );
    });

    it('sends a confirmation to the resident after upload is successful', async () => {
      await model.handleSubmit(values, evidenceRequestId);
      expect(
        mockSendUploadConfirmationNotificationToResident
      ).toHaveBeenCalledTimes(1);
    });
  });
});
