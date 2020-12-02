import { useRouter } from 'next/router';
import Link from 'next/link';

import providers from 'pages/providers/providers.json';
import lessons from 'pages/provider/[provider]/lessons/lessons.json';

const Lessons = ({lessons}) => {

    const router = useRouter();

    const _lessons = lessons.filter(lesson => lesson.provider === router.query.provider).map(lesson => 
        <li>
            <Link 
                href={{
                        pathname: '/provider/[provider]/lessons/[lesson]',
                        query: { provider: router.query.provider, lesson: lesson.slug },
                    }}
            >
                <a>{lesson.title}</a>
            </Link>
        </li>);
    
        return (
            <ul>
                { _lessons }
            </ul>
        )
    };
    
export default Lessons;

export async function getStaticProps() {    
    return {
      props: {
        lessons: lessons.lessonList,
      },
    }
}

export async function getStaticPaths() {

    const paths = providers.providersList.map(provider => {
        return { params: { provider: provider.slug }}
    });

    return { paths, fallback: false }
}
