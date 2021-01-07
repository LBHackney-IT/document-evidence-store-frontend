import Head from 'next/head';
import { Heading, HeadingLevels } from 'lbh-frontend-react';
import { ReactNode } from 'react';
import Layout from 'src/components/DashboardLayout';
import { useRouter } from 'next/router';

const ResidentPage = (): ReactNode => {
    const router = useRouter();
    const { residentId } = router.query;

    return (
        <Layout>
        <Head>
            <title>Resident</title>
        </Head>
        <Heading level={HeadingLevels.H2}>{residentId}</Heading>
        </Layout>
    );
};

export default ResidentPage;