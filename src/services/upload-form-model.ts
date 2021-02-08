import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';
import { S3Gateway } from '../gateways/s3-gateway';
import * as Yup from 'yup';
import { InternalApiGateway } from '../gateways/internal-api';

export type FormValues = {
  [key: string]: File;
};

export class UploadFormModel {
  private s3 = new S3Gateway();
  private gateway = new InternalApiGateway();
  constructor(private submissions: DocumentSubmission[]) {}

  get schema(): Yup.ObjectSchema {
    return Yup.object(
      this.submissions.reduce(
        (others, key) => ({
          ...others,
          [key.id]: Yup.mixed().required('Please select a file'),
        }),
        {}
      )
    );
  }

  get initialValues(): FormValues {
    return this.submissions.reduce(
      (others, key) => ({
        ...others,
        [key.id]: null,
      }),
      {}
    );
  }

  async handleSubmit(values: FormValues): Promise<void> {
    const requests = Object.entries(values).map(async ([id, file]) => {
      await this.uploadFile(id, file);
      // await this.updateDocumentState(id);
    });

    await Promise.all(requests);
  }

  private async uploadFile(id: string, file: File) {
    const submission = this.submissions.find((s) => s.id === id);
    if (!submission || !submission.uploadPolicy) return;

    await this.s3.upload(file, submission.uploadPolicy);
  }

  private async updateDocumentState(id: string) {
    await this.gateway.updateDocumentSubmission(id, {
      state: DocumentState.UPLOADED,
    });
  }
}
