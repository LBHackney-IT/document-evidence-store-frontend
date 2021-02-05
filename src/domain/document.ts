import mimeTypes from 'mime-types';
import { IDocument } from 'types/api';

export class Document implements IDocument {
  id: string;
  fileSize: number;
  fileType: string;

  constructor(params: IDocument) {
    this.id = params.id;
    this.fileSize = params.fileSize;
    this.fileType = params.fileType;
  }

  get extension(): string | undefined {
    return mimeTypes.extension(this.fileType) || undefined;
  }
}
