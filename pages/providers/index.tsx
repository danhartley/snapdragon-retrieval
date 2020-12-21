import Link from 'next/link';
import Layout from 'components/layout/layout';
import providers from 'pages/providers/providers.json';

const Providers = ({providers}) => {

const _providers = providers.map(provider => <li><Link href={`/providers/${provider.slug}/lessons`}><a>{provider.name}</a></Link></li>);

    return (
        <Layout title="Providers" header="Providers">
            <ul>
                { _providers }
            </ul>
        </Layout>
    )
};

export default Providers;

export async function getStaticProps() {  
    return {
      props: {
        providers: providers.providersList,
      },
    }
}