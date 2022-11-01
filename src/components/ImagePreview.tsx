import React, { useEffect, useState } from 'react';
import { DocumentSubmission } from '../domain/document-submission';
import styles from '../styles/Document.module.scss';
import LoadingBox from '@govuk-react/loading-box';
import { humanFileSize } from '../helpers/formatters';
import rotated from '../styles/RotateImage.module.scss';
import RotateDocument from 'src/components/RotateDocument';

const ImagePreview = (props: Props): JSX.Element | null => {
  const [conversionImage, setConversionImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState('');
  const [currentRotation, setCurrentRotation] = useState(0);

  const { documentSubmission, downloadUrl } = props;
  const { document } = documentSubmission;

  if (!document) return null;
  const documentExtension = document?.extension;
  const toConvertDocumentExtensions = ['heic', 'heif'];
  const documentExtensions = ['png', 'jpeg'];

  const rotate = (currentRotation: number) => {
    switch (currentRotation) {
      case 0:
        setRotation(`${rotated.rotated90}`);
        setCurrentRotation(90);
        break;
      case 90:
        setRotation(`${rotated.rotated180}`);
        setCurrentRotation(180);
        break;
      case 180:
        setRotation(`${rotated.rotated270}`);
        setCurrentRotation(270);
        break;
      case 270:
        setRotation(`${rotated.rotated360}`);
        setCurrentRotation(0);
        break;
    }
  };

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
          <RotateDocument
            currentRotation={currentRotation}
            documentSource={downloadUrl}
            rotate={() => rotate(currentRotation)}
            rotation={rotation}
            documentTitle={documentSubmission.documentType.title}
            dataTestId={'default-image'}
          />
        ) : toConvertDocumentExtensions.includes(
            documentExtension as string
          ) ? (
          <LoadingBox
            loading={loading}
            title={documentSubmission.documentType.title}
          >
            <RotateDocument
              currentRotation={currentRotation}
              documentSource={conversionImage}
              rotate={() => rotate(currentRotation)}
              rotation={rotation}
              documentTitle={documentSubmission.documentType.title}
              dataTestId={'conversion-image'}
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
