import { FormValues } from '../upload-form-model';

const { UploadFormModel: ActualFormModel } = jest.requireActual(
  '../upload-form-model'
);

export const mockHandleSubmit = jest.fn();
export const UploadFormModel = jest.fn(
  (formValues: FormValues, evidenceRequestId: string) => {
    const model = new ActualFormModel(formValues, evidenceRequestId);
    model.handleSubmit = mockHandleSubmit;

    return model;
  }
);
