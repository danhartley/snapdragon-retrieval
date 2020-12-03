import { useRouter } from 'next/router';
import { getLessons } from 'api/lessons/utils';

const Lesson = ({lesson}) => {

    const router = useRouter();

    return (
        <div>{lesson.title}</div>
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