import { useRouter } from 'next/router';
import Layout from 'components/layout/layout';
import users from 'pages/users/users.json';
import { getFromLocalStorage } from 'api/state';
import { enums } from 'components/enums';

import Accordion from 'components/accordion/accordion';

const User = ({user, lessons}) => {

    const router = useRouter();

    const query = router.query;

    return (
        <Layout title="User" description={`${user}, user`} header={user}>
            {typeof window !== 'undefined' ? renderScoreHistory() : null}
        </Layout>
    )
};

export default User;

export const getStaticProps = async ({params}) => {
    return {
        props: {
            user: params.user
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

const renderScoreHistory = () => {    
    const histories = getFromLocalStorage(enums.STORAGE_KEY.HISTORY);
    const lessonHistories = histories ? histories.map(history => {
        return {
            ...history
        }
    }) : [];

    const lessonList = lessonHistories.filter(lesson => lesson.total !== null).map(lesson => <li><Accordion lesson={lesson} /></li>);

    return <ul>{lessonList}</ul>
};