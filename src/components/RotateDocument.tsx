import React, { FunctionComponent } from 'react';
import rotated from '../styles/RotateImage.module.scss';

const RotateDocument: FunctionComponent<Props> = ({
  currentRotation,
  documentSource,
  rotate,
  rotation,
  documentTitle,
  dataTestId,
}) => {
  return (
    <div
      className={`${rotated.showRotateButtonOnHover}`}
      style={
        currentRotation == 90 || currentRotation == 270
          ? {
              display: 'inline-block',
              position: 'relative',
              aspectRatio: '1 / 1',
              height: '100%',
              width: '100%',
            }
          : { display: 'inline-block', position: 'relative' }
      }
    >
      <img
        className={rotation}
        src={documentSource}
        alt={documentTitle}
        data-testid={dataTestId}
      />
      <button
        className={`${rotated.rotateButton}`}
        onClick={() => rotate(currentRotation)}
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          float: 'right',
          margin: '0',
          padding: '0',
        }}
        data-testid={'rotate-button'}
      >
        <img src="/rotate-button.svg" alt="rotate" />
      </button>
    </div>
  );
};

type Props = {
  currentRotation: number;
  documentSource: string;
  rotate: (currentRotation: number) => void;
  rotation: string;
  documentTitle: string | undefined;
  dataTestId: string;
};

export default RotateDocument;
