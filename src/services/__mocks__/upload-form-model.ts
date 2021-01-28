import { DocumentSubmission } from 'src/domain/document-submission';

const { UploadFormModel: ActualFormModel } = jest.requireActual(
  '../upload-form-model'
);

export const mockHandleSubmit = jest.fn();
export const UploadFormModel = jest.fn(
  (id: string, submissions: DocumentSubmission[]) => {
    const model = new ActualFormModel(id, submissions);
    model.handleSubmit = mockHandleSubmit;

    return model;
  }
);
