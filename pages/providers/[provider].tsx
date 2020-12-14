import Link from 'next/link';
import Layout from 'components/layout/layout';
import providers from 'pages/providers/providers.json';

import { useRouter } from 'next/router';

const Provider = ({provider}) => {

    const router = useRouter();

    const query = router.query;

    return (
        <Layout title="Provider" description={`${provider}, lesson provider`}>
            <h1>{provider}</h1>
            <Link href={`/providers/${query.provider}/lessons`}>
                <a>Lessons</a>
            </Link>
        </Layout>
    )
};

export default Provider;

export const getStaticProps = async ({params}) => {
    return {
        props: {
            provider: params.provider
        }
    }
};

export const getStaticPaths = async () => {
    
    const paths = providers.providersList.map(provider => `/providers/${provider.slug}`);

    return {
        paths,
        fallback: false
    };
};