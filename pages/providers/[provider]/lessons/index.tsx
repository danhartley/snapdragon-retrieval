import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from 'components/layout/layout';
import { enums } from 'components/enums';
import { getLessons } from 'api/lessons/utils';

import providers from 'pages/providers/providers.json';

import styles from 'pages/providers/[provider]/lessons/lessons.module.scss';

const Lessons = ({lessons}) => {

    const router = useRouter();

    const provider = router.query.provider;

    const shortenTitle = title => {

        let group = '39 Ways to Save the Planet: ';

        title = title.indexOf(group) > -1 ? title.replace(group, '') : title;
        title = title.charAt(0).toUpperCase() + title.slice(1);

        return title;
    };

    const providerLessons = lessons.filter(lesson => lesson.provider === router.query.provider).map(lesson => 
        <li>
            <Link 
                href={{
                        pathname: '/providers/[provider]/lessons/[lesson]',
                        query: { provider, lesson: lesson.slug, type: enums.LESSON_TYPE.QUESTIONS },
                    }}
            >
                <a>{shortenTitle(lesson.title)}</a>
            </Link>
        </li>);
    
        return (
            <Layout title="Lessons" description={`Lessons for ${provider}`} header={lessons.find(l => l.provider === provider).providerName as string}>
                <ul class={styles.list}>
                    { providerLessons }
                </ul>
            </Layout>
        )
};
    
export default Lessons;

export async function getStaticProps() {    
    const providerLessons = getLessons().map(lesson => {
        return { 
            ...lesson,
            providerName: providers.providersList.find(p => p.slug === lesson.provider).name
        };
    });
    return {
      props: {
        lessons: providerLessons
      },
    }
}

export async function getStaticPaths() {

    const paths = providers.providersList.map(provider => {
        return { params: { provider: provider.slug }}
    });

    return { paths, fallback: false }
}
