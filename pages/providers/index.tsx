import Link from 'next/link';

import providers from 'pages/providers/providers.json';

const Providers = ({providers}) => {

const _providers = providers.map(provider => <li><Link href={`/provider/${provider.name}`}><a>{provider.name}</a></Link></li>);

    return (
        <ul>
            { _providers }
        </ul>
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