import { useRouter } from 'next/router';
import { logic } from 'logic/logic';
import { enums } from 'components/enums';
import { getLessons } from 'api/lessons/utils';
import Link from 'next/link';
import Layout from 'components/layout/layout';

import providers from 'pages/providers/providers.json';

import styles from 'pages/providers/[provider]/lessons/lessons.module.scss';

const Lessons = ({lessons}) => {

    const router = useRouter();

    const provider = router.query.provider;

    const providerLessons = lessons.filter(lesson => lesson.provider === router.query.provider);
    const groupedLessons = logic.sortBy(providerLessons.filter(l => l.group).map(l => {
        l.groupIndex = l.group.index;
        return l;
    }), "groupIndex").map(l => lessonLink(provider, l, providerLessons.filter(l => l.group).filter(gl => gl.group.name === l.group.name).length));
    const unGroupedLessons = providerLessons.filter(l => !l.group).map(l => lessonLink(provider, l, 0));

    return (
        <Layout title="Lessons" description={`Lessons for ${provider}`} header={lessons.find(l => l.provider === provider).providerName as string}>
            <ul class={styles.list}>
                { [ ...groupedLessons, ...unGroupedLessons ] }
            </ul>
        </Layout>
    )
};
    
export default Lessons;

const lessonLink = (provider: string | string[], lesson: any, groupCount) => {
    return lesson.groupIndex && lesson.groupIndex === 1 
    ? <>
      <div class={styles.groupHeader}>{lesson.group.name}</div>
      <li class={`${styles.grouped} ${styles.first}`}>
        <Link
            href={{
                pathname: '/providers/[provider]/lessons/[lesson]',
                query: { provider, lesson: lesson.slug, type: enums.LESSON_TYPE.QUESTIONS },
            }}
        >
            <a>{`#${lesson.group.index} ${lesson.group.subtitle}`}</a>
        </Link>
      </li>
      </>
    : <li class={`${lesson.groupIndex ? styles.grouped : null} ${lesson.groupIndex && lesson.groupIndex === groupCount ? styles.last : null}`}>
        <Link
            href={{
                pathname: '/providers/[provider]/lessons/[lesson]',
                query: { provider, lesson: lesson.slug, type: enums.LESSON_TYPE.QUESTIONS },
            }}
        >
            <a>{lesson.group ? `#${lesson.group.index}` : null } {lesson.group ? lesson.group.subtitle : lesson.title}</a>
        </Link>
     </li>
};

export async function getStaticProps() {    

    const allLessons = getLessons().filter(lesson => lesson.isActive).map(lesson => {
        return { 
            ...lesson,
            providerName: providers.providersList.find(p => p.slug === lesson.provider).name
        };
    });
    return {
      props: {
        lessons: allLessons
      },
    }
}

export async function getStaticPaths() {

    const paths = providers.providersList.filter(p => p.slug !== 'snapdragon').map(provider => {
        return { params: { provider: provider.slug }}
    });

    return { paths, fallback: false }
}
