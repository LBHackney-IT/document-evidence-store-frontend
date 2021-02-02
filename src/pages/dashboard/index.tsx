import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ResponseMapper } from 'src/boundary/response-mapper';
import { EvidenceApiGateway } from 'src/gateways/evidence-api';
import { EvidenceRequestResponse } from 'types/api';
import Layout from '../../components/DashboardLayout';
import ResidentSearchForm from '../../components/ResidentSearchForm';
import { ResidentTable } from '../../components/ResidentTable';
import Tabs from '../../components/Tabs';

/* function serialize<PropsType>(gssp: GetServerSideProps<PropsType>) { */
/*   return async (ctx: GetServerSidePropsContext) => { */
/*     const result = await gssp(ctx); */

/*     if (!('props' in result)) return result; */

/*     const serializedProps = superjson.stringify(result.props); */
/*     console.log(serializedProps); */
/*     return { props: { serializedProps } }; */
/*   }; */
/* } */

/* function Deserialize<PropsType>(Page: NextPage<PropsType>) { */
/*   return (props: { serializedProps: string }) => { */
/*     const _props = superjson.parse<PropsType>(props.serializedProps); */
/*     return <Page {..._props} />; */
/*   }; */
/* } */

type BrowseResidentsProps = {
  evidenceRequestsResponse: EvidenceRequestResponse[];
};

const BrowseResidents: NextPage<BrowseResidentsProps> = ({
  evidenceRequestsResponse,
}) => {
  const evidenceRequests = evidenceRequestsResponse.map(
    ResponseMapper.mapEvidenceRequest
  );
  const handleSearch = () => {
    // handle search here
  };

  return (
    <Layout>
      <Head>
        <title>Browse residents</title>
      </Head>
      <h1 className="lbh-heading-h2">Browse residents</h1>

      <ResidentSearchForm handleSearch={handleSearch} />

      <Tabs
        tabTitles={['To review (3)', 'All (3)']}
        children={[
          <div key="1">
            <Heading level={HeadingLevels.H3}>To review</Heading>
            <ResidentTable residents={evidenceRequests} />
          </div>,
          <div key="2">
            <Heading level={HeadingLevels.H3}>All residents</Heading>
            <ResidentTable residents={evidenceRequests} />
          </div>,
        ]}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<BrowseResidentsProps> = async () => {
  const gateway = new EvidenceApiGateway();
  const evidenceRequestsResponse = await gateway.getEvidenceRequests();
  return {
    props: { evidenceRequestsResponse },
  };
};

/* export const getServerSideProps = serialize(_getServerSideProps); */
export default BrowseResidents;
