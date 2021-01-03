import { useRouter } from 'next/router';
import Layout from 'components/layout/layout';
import users from 'pages/users/users.json';
import { getFromLocalStorage } from 'api/state';
import { enums } from 'components/enums';

import Accordion from 'components/accordion/accordion';

import styles from 'pages/users/users.module.scss';

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

    const lessonList = lessonHistories.filter(lesson => lesson.total !== null).map(lesson => {
           return (
            !lesson.scores ? null :
            <li>
                <Accordion lesson={lesson}>
                    <div>total: {lesson.total}</div>
                    <div>correct: {lesson.correct}</div>
                    <ul>
                    {
                        lesson.scores.map(score => {
                            return (
                                <li class={styles.markedAnswers}>
                                    <div class={styles.q}><span>Q.</span><span>{score.text}</span></div>
                                    <div class={styles.a}><span>A.</span><span>{score.answers.map(answer => <span>{answer}</span>)}</span></div>
                                    <div class={`${styles.score} ${score.correct === score.total ? styles.isCorrect : null}`}>{score.correct}/{score.total}</div>
                                </li>
                            )
                        })
                    }
                    </ul>
                </Accordion>
            </li>
           )
    });

    return <ul>{lessonList}</ul>
};