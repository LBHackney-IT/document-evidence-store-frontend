import { UploadFormModel } from './upload-form-model';
import documentSubmissionFixture from '../../cypress/fixtures/document_submissions/index.json';
import { ResponseMapper } from '../boundary/response-mapper';

const documentSubmission = documentSubmissionFixture.map((ds) =>
  ResponseMapper.mapDocumentSubmission(ds)
)[0];
const documentTypes = documentSubmissionFixture.map(
  (ds) => ResponseMapper.mapDocumentSubmission(ds).documentType
);

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

  // describe('handleSubmit', () => {
  //   const fileList1 = [new File(['foo'], 'foo.txt')];
  //   const fileList2 = [
  //     new File(['bar'], 'bar.png'),
  //     new File(['baz'], 'baz.png'),
  //   ];
  //
  //   const values: FormValues = {
  //     [documentTypes[0].id]: fileList1,
  //     [documentTypes[1].id]: fileList2,
  //   };
  //
  //   it('creates document submission for each file', async () => {
  //     await model.handleSubmit(values, evidenceRequestId);
  //     const firstFormData = new FormData();
  //     firstFormData.append('documentType', documentTypes[0].id);
  //     firstFormData.append('document', fileList1[0]);
  //
  //     const secondFormData = new FormData();
  //     secondFormData.append('documentType', documentTypes[1].id);
  //     secondFormData.append('document', fileList2[0]);
  //
  //     const thirdFormData = new FormData();
  //     thirdFormData.append('documentType', documentTypes[1].id);
  //     thirdFormData.append('document', fileList2[1]);
  //
  //     expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
  //       1,
  //       Constants.DUMMY_EMAIL,
  //       evidenceRequestId,
  //       firstFormData
  //     );
  //     expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
  //       2,
  //       Constants.DUMMY_EMAIL,
  //       evidenceRequestId,
  //       secondFormData
  //     );
  //     expect(mockCreateDocumentSubmission).toHaveBeenNthCalledWith(
  //       3,
  //       Constants.DUMMY_EMAIL,
  //       evidenceRequestId,
  //       thirdFormData
  //     );
  //   });
  // });
});
