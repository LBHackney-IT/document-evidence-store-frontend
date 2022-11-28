import { InternalApiGateway } from '../gateways/internal-api';
import { DocumentType } from '../domain/document-type';
import { S3Gateway } from '../gateways/s3-gateway';
import { DocumentSubmission } from 'src/domain/document-submission';
import { StaffUploadFormValues } from 'src/components/StaffUploaderForm';

export class StaffUploadFormModel {
  private gateway = new InternalApiGateway();
  private s3Gateway = new S3Gateway();
  constructor(private staffSelectedDocumentTypes: DocumentType[]) {}

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

  async handleSubmit(
    userEmail: string,
    residentId: string,
    teamName: string,
    formValues: StaffUploadFormValues
  ): Promise<void> {
    const createDocumentSubmissionAndUploadForEachFile = formValues.staffUploaderPanel.map(
      async (uploaderPanel) => {
        if (uploaderPanel.files) {
          for (const file of uploaderPanel.files) {
            const documentSubmission = await this.gateway.createDocumentSubmissionWithoutEvidenceRequest(
              userEmail,
              {
                residentId,
                team: teamName,
                userCreatedBy: userEmail,
                staffSelectedDocumentTypeId:
                  uploaderPanel.staffSelectedDocumentType,
                documentDescription: uploaderPanel.description,
              }
            );
            await this.uploadFile(file, documentSubmission);
          }
        }
      }
    );

    await Promise.all(createDocumentSubmissionAndUploadForEachFile);
  }

  private async uploadFile(file: File, documentSubmission: DocumentSubmission) {
    if (!documentSubmission || !documentSubmission.uploadPolicy) return;

    await this.s3Gateway.upload(file, documentSubmission.uploadPolicy);
  }
}
