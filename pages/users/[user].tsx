import { useRouter } from 'next/router';
import Layout from 'components/layout/layout';
import users from 'pages/users/users.json';
import { getFromLocalStorage } from 'api/state';
import { enums } from 'components/enums';
import { getLessons } from 'api/lessons/utils';

import Accordion from 'components/accordion/accordion';

const User = ({user, lessons}) => {

    const router = useRouter();

    const query = router.query;

    return (
        <Layout title="User" description={`${user}, user`} header={user}>
            {typeof window !== 'undefined' ? renderScoreHistory(lessons) : null}
        </Layout>
    )
};

export default User;

export const getStaticProps = async ({params}) => {
    const lessons = getLessons();
    return {
        props: {
            user: params.user,
            lessons
        }
    }
};

export const getStaticPaths = async () => {
    
    const paths = users.usersList.map(user => `/users/${user.slug}`);

    return {
        paths,
        fallback: false
    };
};

const renderScoreHistory = lessons => {    
    const histories = getFromLocalStorage(enums.STORAGE_KEY.HISTORY);
    const lessonHistories = histories.map(history => {
        return {
            ...history,
            ...lessons.find(lesson => lesson.title === history.lessonTitle)
        }
    });

    const lessonList = lessonHistories.map(lesson => <li><Accordion lesson={lesson} /></li>);

    return <ul>{lessonList}</ul>
};