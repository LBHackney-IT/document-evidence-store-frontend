import { FormValues, UploadFormModel } from './upload-form-model';
import * as S3Gateway from '../gateways/s3-gateway';
import * as MockS3Gateway from '../gateways/__mocks__/s3-gateway';
import documentSubmissionFixture from '../../cypress/fixtures/document-submission-response.json';
import { ResponseMapper } from '../boundary/response-mapper';

const { uploadMock } = S3Gateway as typeof MockS3Gateway;
const documentSubmissions = documentSubmissionFixture.map((ds) =>
  ResponseMapper.mapDocumentSubmission(ds)
);

jest.mock('../gateways/s3-gateway');

const mockUpdateState = jest.fn();
jest.mock('../gateways/internal-api', () => ({
  InternalApiGateway: jest.fn(() => ({
    updateDocumentSubmission: mockUpdateState,
  })),
}));

describe('UploadFormModel', () => {
  let model: UploadFormModel;
  const evidenceRequestId = 'evidence-request-id';

  beforeEach(() => {
    model = new UploadFormModel(evidenceRequestId, documentSubmissions);
  });

  describe('initialValues', () => {
    it('has the correct IDs', () => {
      const values = model.initialValues;
      expect(values).toMatchObject({
        [documentSubmissions[0].id]: null,
        [documentSubmissions[1].id]: null,
      });
    });
  });

  describe('handleSubmit', () => {
    const file1 = new File(['foo'], 'foo.txt');
    const file2 = new File(['bar'], 'bar.png');

    const values: FormValues = {
      [documentSubmissions[0].id]: file1,
      [documentSubmissions[1].id]: file2,
    };

    it('calls s3 for each submission', async () => {
      await model.handleSubmit(values);

      expect(uploadMock).toHaveBeenNthCalledWith(
        1,
        file1,
        documentSubmissions[0].uploadPolicy
      );
      expect(uploadMock).toHaveBeenNthCalledWith(
        2,
        file2,
        documentSubmissions[1].uploadPolicy
      );
    });

    it('updates the state of each submission', async () => {
      await model.handleSubmit(values);

      expect(mockUpdateState).toHaveBeenNthCalledWith(
        1,
        evidenceRequestId,
        documentSubmissions[0].id,
        { state: 'UPLOADED' }
      );
      expect(mockUpdateState).toHaveBeenNthCalledWith(
        2,
        evidenceRequestId,
        documentSubmissions[1].id,
        { state: 'UPLOADED' }
      );
    });
  });
});
