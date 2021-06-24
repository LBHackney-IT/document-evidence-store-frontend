import { FormValues, UploadFormModel } from './upload-form-model';
import documentSubmissionFixture from '../../cypress/fixtures/document_submissions/index.json';
import evidenceRequestFixture from '../../cypress/fixtures/evidence_requests/index.json';
import { ResponseMapper } from '../boundary/response-mapper';
import { Constants } from 'src/helpers/Constants';
import { DocumentSubmissionRequest } from 'src/gateways/internal-api';

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
const fooInBase64 = 'data:application/octet-stream;base64,Zm9v';
const barInBase64 = 'data:application/octet-stream;base64,YmFy';
const bazInBase64 = 'data:application/octet-stream;base64,YmF6';

const mockCreateDocumentSubmission = jest.fn(() => documentSubmission);
jest.mock('../gateways/internal-api', () => ({
  InternalApiGateway: jest.fn(() => ({
    createDocumentSubmission: mockCreateDocumentSubmission,
  })),
}));

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

    const firstBase64: DocumentSubmissionRequest = {
      base64Document: fooInBase64,
      documentType: documentTypes[0].id,
    };

    const secondBase64: DocumentSubmissionRequest = {
      base64Document: barInBase64,
      documentType: documentTypes[1].id,
    };

    const thirdBase64: DocumentSubmissionRequest = {
      base64Document: bazInBase64,
      documentType: documentTypes[1].id,
    };

    it('creates document submission for each file', async () => {
      await model.handleSubmit(values, evidenceRequestId);
      const firstFormData = new FormData();
      firstFormData.append('base64Document', fileList1[0]);
      firstFormData.append('documentType', documentTypes[0].id);

      const secondFormData = new FormData();
      secondFormData.append('base64Document', fileList2[0]);
      secondFormData.append('documentType', documentTypes[1].id);

      const thirdFormData = new FormData();
      thirdFormData.append('base64Document', fileList2[1]);
      thirdFormData.append('documentType', documentTypes[1].id);

      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        1,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        firstBase64
      );
      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        2,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        secondBase64
      );
      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        3,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        thirdBase64
      );
    });
  });
});
