import mimeTypes from 'mime-types';

export interface IDocument {
  id: string;
  fileSizeInBytes: number;
  fileType: string;
  extension: string | undefined;
}

export class Document implements IDocument {
  id: string;
  fileSizeInBytes: number;
  fileType: string;

  constructor(params: IDocument) {
    this.id = params.id;
    this.fileSizeInBytes = params.fileSizeInBytes;
    this.fileType = params.fileType;
  }

  get extension(): string | undefined {
    return mimeTypes.extension(this.fileType) || undefined;
  }
}
