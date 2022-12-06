import mimeTypes from 'mime-types';

export interface IDocument {
  id: string;
  fileSizeInBytes: number;
  fileType: string;
  description?: string;
}

export class Document implements IDocument {
  id: string;
  fileSizeInBytes: number;
  fileType: string;
  description?: string;

  constructor(params: IDocument) {
    this.id = params.id;
    this.fileSizeInBytes = params.fileSizeInBytes;
    this.fileType = params.fileType;
    this.description = params.description;
  }

  get extension(): string | undefined {
    return mimeTypes.extension(this.fileType) || undefined;
  }
}
