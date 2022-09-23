import React, { FunctionComponent } from 'react';

const PageWarning: FunctionComponent<Props> = (props) => {
  return (
    <section className="lbh-page-announcement lbh-page-announcement--warning">
      <h3 className="lbh-page-announcement__title">{props.title}</h3>
      <div className="lbh-page-announcement__content">{props.content}</div>
    </section>
  );
};

export interface Props {
  title: string;
  content: string;
}

export default PageWarning;
