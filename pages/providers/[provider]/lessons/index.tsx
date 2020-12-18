import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from 'components/layout/layout';
import { enums } from 'components/enums';
import { getLessons } from 'api/lessons/utils';

import providers from 'pages/providers/providers.json';

const Lessons = ({lessons}) => {

    const router = useRouter();

    const provider = router.query.provider;

    const providerLessons = lessons.filter(lesson => lesson.provider === router.query.provider).map(lesson => 
        <li>
            <Link 
                href={{
                        pathname: '/providers/[provider]/lessons/[lesson]',
                        query: { provider, lesson: lesson.slug, type: lesson.cards ? enums.LESSON_TYPE.CARDS : enums.LESSON_TYPE.QUESTIONS },
                    }}
            >
                <a>{lesson.title}</a>
            </Link>
        </li>);
    
        return (
            <Layout title="Lessons" description={`Lessons for ${provider}`} header={provider}>
                <ul>
                    { providerLessons }
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
