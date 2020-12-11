import Link from 'next/link';
import Layout from 'components/layout/layout';
import users from 'pages/users/users.json';

import { useRouter } from 'next/router';

const User = ({user}) => {

    const router = useRouter();

    const query = router.query;

    return (
        <Layout title="User" description={`${user}, user`}>
            <h1>{user}</h1>            
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