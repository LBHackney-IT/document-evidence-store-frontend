import axios from 'axios';
import { UploadPolicy } from 'src/domain/document-submission';
import { S3Gateway } from './s3-gateway';
import fs from 'fs';
import { resolve } from 'path';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('S3 Gateway', () => {
  const gateway = new S3Gateway();
  let file: File;

  beforeAll(async () => {
    const buffer = fs.readFileSync(
      resolve(process.cwd(), 'cypress/fixtures/example.png')
    );
    file = new File([buffer], 'file.png');
  });

  describe('upload', () => {
    const policy: UploadPolicy = {
      url: 'https://s3.eu-west-2.amazonaws.com/documents-api-staging-bucket',
      fields: {
        key1: 'value1',
        key2: 'value2',
      },
    };

    it('posts to s3', async () => {
      await gateway.upload(file, policy);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        policy.url,
        expect.any(FormData)
      );
    });

    it('uses the correct form data', async () => {
      await gateway.upload(file, policy);
      const data: FormData = mockedAxios.post.mock.calls[0][1];

      const dataArray = Array.from(data.entries());

      // AWS is fussy about the order, the file must be last
      expect(dataArray).toEqual([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['Content-Type', 'image/png'],
        ['file', file],
      ]);
    });
  });
});
