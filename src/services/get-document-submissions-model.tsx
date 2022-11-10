import { InternalApiGateway } from 'src/gateways/internal-api';
import { DocumentSubmissionsObject } from 'src/domain/document-submission';

export class DocumentSubmissionsModel {
  private gateway = new InternalApiGateway();

  async handleSubmit(
    userEmail: string,
    residentId: string,
    team: string,
    currentPage: string,
    pageSize: string
  ): Promise<DocumentSubmissionsObject> {
    const docSubmissionObject = await this.gateway.getDocumentSubmissions(
      userEmail,
      residentId,
      team,
      currentPage,
      pageSize
    );
    console.log(
      `the document submission object looks like this : ${JSON.stringify(
        docSubmissionObject
      )}`
    );
    return docSubmissionObject;
  }
}
