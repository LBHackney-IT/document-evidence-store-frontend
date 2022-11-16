import { InternalApiGateway } from '../gateways/internal-api';
import { DocumentType } from '../domain/document-type';
import { Constants } from '../helpers/Constants';
import { S3Gateway } from '../gateways/s3-gateway';
import { DocumentSubmission } from 'src/domain/document-submission';

export type FormValues = {
  [documentTypeId: string]: File[];
};

export class StaffUploadFormModel {
  private gateway = new InternalApiGateway();
  private s3Gateway = new S3Gateway();
  constructor(private documentTypes: DocumentType[]) {}

  // See DOC-964 for more details about this commented section.
  // get schema(): Yup.ObjectSchema {
  //   return Yup.object(
  //     this.documentTypes.reduce(
  //       (others, key) => ({
  //         ...others,
  //         [key.id]: Yup.mixed().required('Please select a file'),
  //       }),
  //       {}
  //     )
  //   );
  // }

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
    residentId: string
  ): Promise<void> {
    const createDocumentSubmissionAndUploadForEachFile = Object.entries(
      formValues
    ).map(async ([staffSelectedDocumentTypeId, files]) => {
      if (files) {
        for (const file of files) {
          const documentSubmission = await this.gateway.createDocumentSubmissionWithoutEvidenceRequest(
            // need to implement this function
            Constants.DUMMY_EMAIL,
            residentId,
            {
              staffSelectedDocumentType: staffSelectedDocumentTypeId,
            }
          );
          await this.uploadFile(file, documentSubmission);
        }
      }
    });

    await Promise.all(createDocumentSubmissionAndUploadForEachFile);
  }

  private async uploadFile(file: File, documentSubmission: DocumentSubmission) {
    if (!documentSubmission || !documentSubmission.uploadPolicy) return;

    await this.s3Gateway.upload(file, documentSubmission.uploadPolicy);
  }
}
