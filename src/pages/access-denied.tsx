import React, { FunctionComponent } from 'react';
import Layout from 'src/components/ResidentLayout';

const AccessDeniedPage: FunctionComponent = () => {
  return (
    <Layout feedbackUrl={process.env.FEEDBACK_FORM_RESIDENT_URL as string}>
      <h1> Access denied </h1>
    </Layout>
  );
};

export default AccessDeniedPage;
