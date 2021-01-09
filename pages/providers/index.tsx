import Link from 'next/link';
import Layout from 'components/layout/layout';
import providers from 'pages/providers/providers.json';
import { getLessons } from 'api/lessons/utils';

const Providers = ({providers, lessonsProviders}) => {

const providersWithLessons = providers.filter(p => lessonsProviders.indexOf(p.slug) > -1);
const providerList = providersWithLessons.map(provider => <li><Link href={`/providers/${provider.slug}/lessons`}><a>{provider.name}</a></Link></li>);

    return (
        <Layout title="Providers" header="Providers">
            <ul>
                { providerList }
            </ul>
        </Layout>
    )
};

export default Providers;

export async function getStaticProps() {
    const lessonsProviders = getLessons().map(l => l.provider);
    return {
      props: {
        providers: providers.providersList,
        lessonsProviders
      },
    }
}