import { useRouter } from 'next/router';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

import providers from 'pages/providers/providers.json';

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

    var EXTENSION = '.json';
    
    const lessons = [];

    const files = fs.readdirSync('api/lessons').filter(file => path.extname(file).toLowerCase() === EXTENSION);
    
    files.forEach(file => {
        const lesson = JSON.parse(fs.readFileSync(`api/lessons/${file}`, 'utf8'));
        lessons.push(lesson);
    });

    return {
      props: {
        lessons
      },
    }
}

export async function getStaticPaths() {

    const paths = providers.providersList.map(provider => {
        return { params: { provider: provider.slug }}
    });

    return { paths, fallback: false }
}
