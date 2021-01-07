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
                <title>Firstname Surname</title>
            </Head>
            <Heading level={HeadingLevels.H2}>Firstname Surname</Heading>
            <p>0777 777 7777</p>
            <p>email@email.com</p>

            {residentId}


        </Layout>
    );
};

export default ResidentPage;