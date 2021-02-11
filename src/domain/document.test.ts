import { Document } from './document';

describe('Document', () => {
  let doc: Document;

  beforeEach(() => {
    doc = new Document({
      id: 'id',
      fileSizeInBytes: 5000,
      fileType: 'image/png',
    });
  });

  it('has an extension', () => {
    expect(doc.extension).toEqual('png');
  });
});
