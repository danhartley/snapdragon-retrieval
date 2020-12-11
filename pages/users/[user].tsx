import Link from 'next/link';
import Layout from 'components/layout/layout';
import users from 'pages/users/users.json';
import { getFromLocalStorage } from 'api/state';
import { enums } from 'components/enums';

import { useRouter } from 'next/router';

const User = ({user}) => {

    const router = useRouter();

    const query = router.query;

    return (
        <Layout title="User" description={`${user}, user`}>
            <h1>{user}</h1>
            {renderScoreHistory()}
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
    
    const paths = users.usersList.map(user => `/users/${user.username}`);

    return {
        paths,
        fallback: false
    };
};

const renderScoreHistory = () => {
    const history = getFromLocalStorage(enums.STORAGE_KEY.HISTORY);
    const histories = history.map(h => {
        return (
            <>
            <div>title: {h.lessonTitle}</div>
            <div>total: {h.total}</div>
            <div>correct: {h.correct}</div>
            </>
        );
    });
    return histories;
};