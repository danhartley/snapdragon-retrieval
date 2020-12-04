import { useRouter } from 'next/router';
import { getLessons } from 'api/lessons/utils';
import Layout from 'components/layout';
import { Card } from 'components/card/card';

const Lesson = ({lesson}) => {

    const router = useRouter();

    return (
        <Layout title="Lesson">
            <h1>{lesson.title}</h1>
            <Card lesson={lesson}></Card>
        </Layout>
    )
};

export default Lesson;

export async function getStaticProps({params: {provider, lesson}}) {    
    return {
      props: {
        lesson: getLessons().find(lesson => lesson.provider === provider)
      },
    }
}

export async function getStaticPaths() {

    const paths = getLessons().map(lesson => {
        return { params: { provider: lesson.provider, lesson: lesson.slug }}
    });

    return { paths, fallback: false }
}