import ServiceAreaJson from '../../../services.json';
import { ServiceArea } from '../../domain/service-area';
import { withAuth, WithUser } from '../../helpers/authed-server-side-props';
import { NextPage } from 'next';
import Head from 'next/head';
import { ServicesLayout } from '../../components/ServicesLayout';
import Layout from '../../components/DashboardLayout';
import { RequestAuthorizer } from '../../services/request-authorizer';
import { ServiceAreaHelper } from '../../services/service-area-helper';

type ServiceAreaProps = {
  serviceAreas: ServiceArea[];
};

const serviceAreaJson: ServiceArea[] = JSON.parse(
  JSON.stringify(ServiceAreaJson)
);

const Services: NextPage<WithUser<ServiceAreaProps>> = ({ serviceAreas }) => {
  return (
    <Layout>
      <Head>
        <title>Select a service</title>
      </Head>
      <h1 className="lbh-heading-h2">Select a service</h1>

      <ServicesLayout serviceAreas={serviceAreas} />
    </Layout>
  );
};
export const getServerSideProps = withAuth<ServiceAreaProps>(async (ctx) => {
  const requestAuthorizer = new RequestAuthorizer();
  const serviceAreaHelper = new ServiceAreaHelper();

  const user = requestAuthorizer.authoriseUser(ctx.req?.headers.cookie);
  let userServiceAreas: ServiceArea[];

  if (user == undefined) {
    userServiceAreas = [];
  } else {
    userServiceAreas = serviceAreaHelper.filterServiceAreasForUser(
      serviceAreaJson,
      user
    );
  }

  return {
    props: {
      serviceAreas: userServiceAreas,
    },
  };
});

export default Services;
