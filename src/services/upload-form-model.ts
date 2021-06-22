import * as Yup from 'yup';
import { InternalApiGateway } from '../gateways/internal-api';
import { DocumentType } from '../domain/document-type';
import { Constants } from '../helpers/Constants';

export type FormValues = {
  [documentTypeId: string]: File[];
};

export class UploadFormModel {
  private gateway = new InternalApiGateway();
  constructor(private documentTypes: DocumentType[]) {}

  get schema(): Yup.ObjectSchema {
    return Yup.object(
      this.documentTypes.reduce(
        (others, key) => ({
          ...others,
          [key.id]: Yup.mixed().required('Please select a file'),
        }),
        {}
      )
    );
  }

  get initialValues(): FormValues {
    return this.documentTypes.reduce(
      (others, key) => ({
        ...others,
        [key.id]: null,
      }),
      {}
    );
  }

  async handleSubmit(
    formValues: FormValues,
    evidenceRequestId: string
  ): Promise<void> {
    const createDocumentSubmissionForEachFile = Object.entries(formValues).map(
      async ([documentTypeId, files]) => {
        for (const file of files) {
          const formData = new FormData();
          formData.append('documentType', documentTypeId);
          formData.append('document', file);
          await this.gateway.createDocumentSubmission(
            Constants.DUMMY_EMAIL,
            evidenceRequestId,
            formData
          );
        }
      }
    );

    await Promise.all(createDocumentSubmissionForEachFile);
  }
}
