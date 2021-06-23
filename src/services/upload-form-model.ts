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
  imageToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (): void => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject(new Error('No result from reading file as data URL'));
        }
      };

      reader.onerror = (error): void => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });

  async handleSubmit(
    formValues: FormValues,
    evidenceRequestId: string
  ): Promise<void> {
    const createDocumentSubmissionForEachFile = Object.entries(formValues).map(
      async ([documentTypeId, files]) => {
        for (const file of files) {
          const fileInBase64 = await this.imageToBase64(file);
          await this.gateway.createDocumentSubmission(
            Constants.DUMMY_EMAIL,
            evidenceRequestId,
            {
              base64Document: fileInBase64,
              documentType: documentTypeId,
            }
          );
        }
      }
    );

    await Promise.all(createDocumentSubmissionForEachFile);
  }
}
