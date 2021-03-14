import {
  DocumentState,
  DocumentSubmission,
} from '../domain/document-submission';
import { S3Gateway } from '../gateways/s3-gateway';
import * as Yup from 'yup';
import { InternalApiGateway } from '../gateways/internal-api';
import { DocumentType } from '../domain/document-type';

export type FormValues = {
  [documentTypeId: string]: FileList;
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
    const documentSubmissionsForFiles: FileDocumentSubmission[] = this.createDocumentSubmissionForEachFile(
      formValues,
      evidenceRequestId
    );

    const uploadFilesAndUpdateDocumentState = documentSubmissionsForFiles.map(
      async (fileDocumentSubmission) => {
        await this.uploadFile(
          fileDocumentSubmission.file,
          fileDocumentSubmission.documentSubmission
        );
        await this.updateDocumentState(
          fileDocumentSubmission.documentSubmission.id
        );
      }
    );

    await Promise.all(uploadFilesAndUpdateDocumentState);
  }

  private createDocumentSubmissionForEachFile(
    formValues: FormValues,
    evidenceRequestId: string
  ): FileDocumentSubmission[] {
    const fileDocumentSubmissions: FileDocumentSubmission[] = [];
    Object.entries(formValues).map(([documentTypeId, fileList]) => {
      Array.from(fileList).forEach(async (file) => {
        const documentSubmission = await this.createDocumentSubmission(
          evidenceRequestId,
          documentTypeId
        );
        fileDocumentSubmissions.push(
          new FileDocumentSubmission(file, documentSubmission)
        );
      });
    });
    return fileDocumentSubmissions;
  }

  private async createDocumentSubmission(
    evidenceRequestId: string,
    documentType: string
  ) {
    return await this.gateway.createDocumentSubmission(
      evidenceRequestId,
      documentType
    );
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
