import { DocumentSubmission } from "src/domain/document-submission";

const { StaffUploadFormModel: ActualFormModel } = jest.requireActual(
  '../staff-upload-form-model'
);

export const mockHandleSubmit = jest.fn();
export const StaffUploadFormModel = jest.fn(
  (file: File, documentSubmission: DocumentSubmission) => {
    const model = new ActualFormModel(file, documentSubmission);
    model.handleSubmit = mockHandleSubmit;

    return model;
  }
);
