import { documentToBase64 } from './document-uploader';

describe('documentToBase64', async () => {
  it('when the file is converted', async () => {
    const file = new File(['This is the content of the file'], 'Test');
    const result = await documentToBase64(file);
    expect(result).not.toBeNull();
  });
});
