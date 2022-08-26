export interface IDocumentType {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
}

export class DocumentType implements IDocumentType {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;

  constructor(params: IDocumentType) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.enabled = params.enabled;
  }
}
