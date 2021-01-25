import { DocumentSubmission } from '../domain/document-submission';
import { S3Gateway } from '../gateways/s3-gateway';
import * as Yup from 'yup';

export type FormValues = {
  [key: string]: File;
};

export class UploadFormModel {
  private gateway = new S3Gateway();
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
    const requests = Object.entries(values).map(([id, file]) =>
      this.uploadFile(id, file)
    );

    await Promise.all(requests);
  }

  private async uploadFile(id: string, file: File) {
    const submission = this.submissions.find((s) => s.id === id);
    if (!submission || !submission.uploadPolicy) return;

    return await this.gateway.upload(file, submission.uploadPolicy);
  }
}
