import React, { FunctionComponent } from 'react';
import styles from 'src/styles/SVGSymbol.module.scss';

const SVGSymbol: FunctionComponent<Props> = ({ status }) => {
  return (
    <>
      {status === 'toReview' && (
        <img src="/exclamation-mark.svg" alt="" className={styles.mark} />
      )}
      {status === 'reviewed' && (
        <img src="/tick-mark.svg" alt="" className={styles.mark} />
      )}
      {status === 'rejected' && (
        <img src="/x-mark.svg" alt="" className={styles.mark} />
      )}
    </>
  );
};

interface Props {
  status: string;
}

export default SVGSymbol;
