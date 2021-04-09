import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';
import { S3Gateway } from '../gateways/s3-gateway';
import * as Yup from 'yup';
import { InternalApiGateway } from '../gateways/internal-api';
import { DocumentType } from '../domain/document-type';

export type FormValues = {
  [documentTypeId: string]: File[];
};

class FileDocumentSubmission {
  file: File;
  documentSubmission: DocumentSubmission;

  constructor(file: File, documentSubmission: DocumentSubmission) {
    this.file = file;
    this.documentSubmission = documentSubmission;
  }
}

export class UploadFormModel {
  private s3 = new S3Gateway();
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
    const fileDocumentSubmissions = await this.createDocumentSubmissionForEachFile(
      formValues,
      evidenceRequestId
    );

    const uploadFilesAndUpdateDocumentStateRequests = fileDocumentSubmissions.map(
      async (fileDocumentSubmission) => {
        /*await this.uploadFile(
          fileDocumentSubmission.file,
          fileDocumentSubmission.documentSubmission
        );*/
        await this.updateDocumentState(
          fileDocumentSubmission.documentSubmission.id
        );
      }
    );

    await Promise.all(uploadFilesAndUpdateDocumentStateRequests);
  }

  private async createDocumentSubmissionForEachFile(
    formValues: FormValues,
    evidenceRequestId: string
  ): Promise<FileDocumentSubmission[]> {
    const fileDocumentSubmissions: FileDocumentSubmission[] = [];
    for (const [documentTypeId, files] of Object.entries(formValues)) {
      for (const file of files) {
        const documentSubmission = await this.gateway.createDocumentSubmission(
          evidenceRequestId,
          documentTypeId
        );
        fileDocumentSubmissions.push(
          new FileDocumentSubmission(file, documentSubmission)
        );
      }
    }
    return fileDocumentSubmissions;
  }

  private async uploadFile(file: File, documentSubmission: DocumentSubmission) {
    if (!documentSubmission || !documentSubmission.uploadPolicy) return;

    await this.s3.upload(file, documentSubmission.uploadPolicy);
  }

  private async updateDocumentState(documentSubmissionId: string) {
    await this.gateway.updateDocumentSubmission(documentSubmissionId, {
      state: DocumentState.UPLOADED,
    });
  }
}
