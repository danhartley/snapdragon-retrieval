import Link from 'next/link';

import providers from 'pages/providers/providers.json';

import { useRouter } from 'next/router';

const Provider = ({provider}) => {

    const router = useRouter();

    const query = router.query;

    return (
        <>
        <div>{provider}</div>
        <Link href={`/provider/${query.provider}/lessons`}>
            <a>Lessons</a>
        </Link>
        </>
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
    
    const paths = providers.providersList.map(provider => `/provider/${provider.name}`);

    return {
        paths,
        fallback: false
    };
};