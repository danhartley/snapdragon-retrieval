import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from 'components/layout';
import { getLessons } from 'api/lessons/utils';

import providers from 'pages/providers/providers.json';

const Lessons = ({lessons}) => {

    const router = useRouter();

    const _lessons = lessons.filter(lesson => lesson.provider === router.query.provider).map(lesson => 
        <li>
            <Link 
                href={{
                        pathname: '/providers/[provider]/lessons/[lesson]',
                        query: { provider: router.query.provider, lesson: lesson.slug },
                    }}
            >
                <a>{lesson.title}</a>
            </Link>
        </li>);
    
        return (
            <Layout title="Lessons">
                <ul>
                    { _lessons }
                </ul>
            </Layout>
        )
    };
    
export default Lessons;

export async function getStaticProps() {    
    return {
      props: {
        lessons: getLessons()
      },
    }
}

export async function getStaticPaths() {

    const paths = providers.providersList.map(provider => {
        return { params: { provider: provider.slug }}
    });

    return { paths, fallback: false }
}
