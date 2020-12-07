export interface IDocumentType {
  id: string;
  title: string;
  description?: string;
}

export class DocumentType implements IDocumentType {
  id: string;
  title: string;
  description?: string;

  constructor(params: IDocumentType) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
  }
}
