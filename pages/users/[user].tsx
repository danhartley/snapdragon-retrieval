import { useRouter } from 'next/router';
import Layout from 'components/layout/layout';
import users from 'pages/users/users.json';
import { getFromLocalStorage } from 'api/state';
import { enums } from 'components/enums';
import { getLessonSummaries } from 'api/api-effects';
import { getLessons } from 'api/lessons/utils';

import providers from 'pages/providers/providers.json';

import Accordion from 'components/accordion/accordion';

import styles from 'pages/users/users.module.scss';

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
    const lessons = getLessons().map(lesson => {
        return { 
            ...lesson,
            providerName: providers.providersList.find(p => p.slug === lesson.provider).name            
        } as any;
    }) as Array<any>;

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
    const lessonHistories = histories ? histories.filter(h => h.total > 0).map(history => {
        return {
            ...history
        }
    }) : [];

    lessonHistories.forEach(async lh => {
        const lesson = lessons.find(l => l.title === lh.title);
        const ranked = lesson.ranked || [];
        const unranked = lesson.unranked || [];
        const multiplechoice = lesson.multiplechoice || [];
        const multipleselect = lesson.multipleselect || [];
        lesson.questions = [ ...ranked, ...unranked, ...multiplechoice, ...multipleselect ];
        const questionSummaries = await getLessonSummaries(lesson);
        lesson.questions.forEach(question => {
            question.questionSummaries = questionSummaries.find(qs => qs.text === question.text);
        });
        console.log(lesson.questions);
        
    });

    const lessonList = lessonHistories.filter(lesson => lesson.total !== null).map(lesson => {
           return (
            !lesson.scores ? null :
            <li>
                <Accordion lesson={lesson}>
                    <div><span>{`You scored ${lesson.correct} out of ${lesson.total}.`}</span></div>                    
                    <ul>
                    {
                        lesson.scores.map(score => {

                            // const community = lesson.questions.questionSummaries.find(qs => qs.text === score.text);

                            // async!!

                            return (
                                <>
                                {/* <div><span>{`Average score ${community.correct/community.total} out of ${lesson.total}.`}</span></div> */}
                                <li class={styles.markedAnswers}>
                                    <div class={styles.q}><span>Q.</span><span>{score.text}</span></div>
                                    <div class={styles.a}><span>A.</span><span>{score.answers.map(answer => <span>{answer}</span>)}</span></div>
                                    <div class={styles.score}>
                                        <div>{score.correct}/{score.total}</div><div class={`${score.correct === score.total ? styles.isCorrect : null}`}></div>
                                    </div>
                                </li>
                                </>
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