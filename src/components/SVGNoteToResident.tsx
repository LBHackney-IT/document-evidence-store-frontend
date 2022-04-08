import React, { FunctionComponent } from 'react';
import styles from 'src/styles/SVGNoteToResident.module.scss';

const SVGNoteToResident: FunctionComponent = () => {
  return (
    <>
      <img src="/note-to-resident.svg" alt="note" className={styles.note} />
    </>
  );
};

export default SVGNoteToResident;
