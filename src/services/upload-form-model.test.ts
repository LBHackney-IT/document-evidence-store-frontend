import { FormValues, UploadFormModel } from './upload-form-model';
import * as S3Gateway from '../gateways/s3-gateway';
import * as MockS3Gateway from '../gateways/__mocks__/s3-gateway';
import documentSubmissionFixture from '../../cypress/fixtures/document_submissions/index.json';
import { ResponseMapper } from '../boundary/response-mapper';
import { Constants } from '../helpers/Constants';

const { uploadMock } = S3Gateway as typeof MockS3Gateway;
const evidenceRequestId = '123';
const documentSubmission = documentSubmissionFixture.map((ds) =>
  ResponseMapper.mapDocumentSubmission(ds)
)[0];
const documentTypes = documentSubmissionFixture.map(
  (ds) => ResponseMapper.mapDocumentSubmission(ds).documentType
);

jest.mock('../gateways/s3-gateway');

const mockUpdateState = jest.fn();
const mockCreateDocumentSubmission = jest.fn(() => documentSubmission);
jest.mock('../gateways/internal-api', () => ({
  InternalApiGateway: jest.fn(() => ({
    updateDocumentSubmission: mockUpdateState,
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

    it('creates document submission for each file', async () => {
      await model.handleSubmit(values, evidenceRequestId);

      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        1,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        documentTypes[0].id
      );
      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        2,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        documentTypes[1].id
      );
      expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
        2,
        Constants.DUMMY_EMAIL,
        evidenceRequestId,
        documentTypes[1].id
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

    it('updates the state of each submission', async () => {
      await model.handleSubmit(values, evidenceRequestId);

      expect(mockUpdateState).toHaveBeenNthCalledWith(
        1,
        Constants.DUMMY_EMAIL,
        documentSubmission.id,
        { state: 'UPLOADED' }
      );
      expect(mockUpdateState).toHaveBeenNthCalledWith(
        2,
        Constants.DUMMY_EMAIL,
        documentSubmission.id,
        { state: 'UPLOADED' }
      );
      expect(mockUpdateState).toHaveBeenNthCalledWith(
        3,
        Constants.DUMMY_EMAIL,
        documentSubmission.id,
        { state: 'UPLOADED' }
      );
    });
  });
});
