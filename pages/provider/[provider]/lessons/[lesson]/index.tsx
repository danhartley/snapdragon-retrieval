import { useRouter } from 'next/router';

import lessons from 'pages/provider/[provider]/lessons/lessons.json';

const Lesson = ({lesson}) => {

    const router = useRouter();

    console.log('router.query: ', router.query)

    return (
        <div>{lesson.title}</div>
    )
};

export default Lesson;

export async function getStaticProps({params: {provider, lesson}}) {    
    return {
      props: {
        lesson: lessons.lessonList.find(lesson => lesson.provider === provider)
      },
    }
}

export async function getStaticPaths() {

    const paths = lessons.lessonList.map(lesson => {
        return { params: { provider: lesson.provider, lesson: lesson.slug }}
    });

    return { paths, fallback: false }
}