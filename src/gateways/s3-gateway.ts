import Axios from 'axios';
import FileType from 'file-type/browser';
import { UploadPolicy } from 'src/domain/document-submission';

export class S3Gateway {
  async upload(file: File, policy: UploadPolicy): Promise<void> {
    const formData = new FormData();

    Object.entries(policy.fields).forEach(([k, v]) => formData.append(k, v));
    formData.append('file', file);

    const fileType = await FileType.fromBlob(file);
    formData.append('Content-Type', fileType?.mime ?? file.type);

    await Axios.post(policy.url, formData);
  }
}
