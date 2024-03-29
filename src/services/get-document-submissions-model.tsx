import { InternalApiGateway } from 'src/gateways/internal-api';
import { DocumentSubmissionsObject } from 'src/domain/document-submission';

export class DocumentSubmissionsModel {
  private gateway = new InternalApiGateway();

  async handleSubmit(
    userEmail: string,
    residentId: string,
    team: string,
    currentPage: string,
    pageSize: string,
    state?: string
  ): Promise<DocumentSubmissionsObject> {
    const docSubmissionObject = await this.gateway.getDocumentSubmissions(
      userEmail,
      residentId,
      team,
      currentPage,
      pageSize,
      state
    );
    return docSubmissionObject;
  }
}
