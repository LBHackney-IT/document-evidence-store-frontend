import { FunctionComponent } from 'react';

const PageWarning: FunctionComponent = () => {
  return (
    <section className="lbh-page-announcement lbh-page-announcement--warning">
      <h3 className="lbh-page-announcement__title">
        This document is no longer valid
      </h3>
      <div className="lbh-page-announcement__content">
        If you need to use this document to prove eligibility, request a new
        version from the resident.
      </div>
    </section>
  );
};

export default PageWarning;
