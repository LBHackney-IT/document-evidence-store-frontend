import React, { useEffect, useState } from 'react';
import { DocumentSubmission } from '../domain/document-submission';
import styles from '../styles/Document.module.scss';
import LoadingBox from '@govuk-react/loading-box';
import { humanFileSize } from '../helpers/formatters';

const ImagePreview = (props: Props): JSX.Element | null => {
  const [conversionImage, setConversionImage] = useState('');
  const [loading, setLoading] = useState(true);

  const { documentSubmission, downloadUrl } = props;
  const { document } = documentSubmission;

  if (!document) return null;
  const documentExtension = document?.extension;
  const toConvertDocumentExtensions = ['heic', 'heif'];
  const documentExtensions = ['png', 'jpeg'];
  if (toConvertDocumentExtensions.includes(documentExtension as string)) {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        (async () => {
          const { default: heic2any } = await import('heic2any');
          fetch(downloadUrl)
            .then((res) => res.blob())
            .then((blob) =>
              heic2any({
                blob,
              })
            )
            .then((conversionResult) => {
              setConversionImage(URL.createObjectURL(conversionResult));
              setLoading(false);
            })
            .catch((e) => {
              console.log(e);
            });
        })();
      }
    }, []);
  }
  return (
    <div>
      <figure className={styles.preview}>
        {documentExtensions.includes(documentExtension as string) ? (
          <img src={downloadUrl} alt={documentSubmission.documentType.title} />
        ) : toConvertDocumentExtensions.includes(
            documentExtension as string
          ) ? (
          <LoadingBox
            loading={loading}
            title={documentSubmission.documentType.title}
          >
            <img
              src={conversionImage}
              alt={documentSubmission.documentType.title}
              data-testid="conversion-image"
            />
          </LoadingBox>
        ) : (
          <iframe src={downloadUrl} height="1000px" width="800px" />
        )}

        <figcaption className="lbh-body-s">
          <strong>{document.extension?.toUpperCase()}</strong>{' '}
          {humanFileSize(document.fileSizeInBytes)}{' '}
        </figcaption>
      </figure>
    </div>
  );
};

export interface Props {
  documentSubmission: DocumentSubmission;
  downloadUrl: string;
}

export default ImagePreview;
