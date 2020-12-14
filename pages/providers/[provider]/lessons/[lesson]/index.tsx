import { useRouter } from 'next/router';
import { getLessons } from 'api/lessons/utils';
import Layout from 'components/layout/layout';
import { Card } from 'components/card/card';
import { Question } from 'components/question/question';
import QueryString from 'components/query-string/query-string';
import { enums } from "components/enums";

const Lesson = ({lesson}) => {

    const router = useRouter();

    const provider = router.query.provider;
    const type = router.query.type;

    return (
        <Layout title="Lesson" description={`${provider} ${lesson.title} lesson`}>
            <h1>{lesson.title}</h1>
            <QueryString options={enums.LESSON_TYPE} lesson={lesson} />
            { type === enums.LESSON_TYPE.CARDS ? <Card lesson={lesson}></Card> : <Question lesson={lesson}></Question> }
        </Layout>
    )
};

export default Lesson;

export async function getStaticProps({params: {provider, lesson}}) {    
    return {
      props: {
        lesson: getLessons().find(l => l.provider === provider && l.slug === lesson)
      },
    }
}

export async function getStaticPaths() {

    const paths = getLessons().map(lesson => {
        return { params: { provider: lesson.provider, lesson: lesson.slug }}
    });

    return { paths, fallback: false }
}