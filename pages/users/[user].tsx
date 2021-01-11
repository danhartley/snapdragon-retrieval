import { useEffect, useState } from 'preact/hooks';
import { useRouter } from 'next/router';
import Layout from 'components/layout/layout';
import Link from 'next/link'
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

    const getLessonHistories = () => {
    
        const histories = getFromLocalStorage(window, enums.STORAGE_KEY.HISTORY);
        const lessonHistories = histories ? histories.filter(h => h.total > 0).map(history => {
            return {
                ...history
            }
        }) : [];
        return lessonHistories;
    };
    
    const [lessonHistories, setLessonHistories] = useState(null);
    const [communityScores, setQuestionSummaries] = useState(null);

    useEffect(() => {
        setLessonHistories(getLessonHistories());
    }, []);

    useEffect(() => {

        if(!lessonHistories) return;

        lessonHistories.forEach(async lh => {
            const lesson = lessons.find(l => l.title === lh.title);
            const ranked = lesson.ranked || [];
            const unranked = lesson.unranked || [];
            const multiplechoice = lesson.multiplechoice || [];
            const multipleselect = lesson.multipleselect || [];
            lesson.questions = [ ...ranked, ...unranked, ...multiplechoice, ...multipleselect ];
            const questionScores = await getLessonSummaries(lesson) as Array<any>;
            const lessonScores = questionScores.reduce((lqs, score) => {
                return {
                    total: score.total + lqs.total,
                    correct: score.correct + lqs.correct
                }
            }, {
                total: 0,
                correct: 0
            });            

            const communityScores = {
                lessonScores : { ...lessonScores, average: Math.round((lessonScores.correct/lessonScores.total)*100) },
                questionScores
            }
            console.log('communityScores:', communityScores);
            setQuestionSummaries(communityScores);
            lh.slug = lesson.slug;
            lh.provider = lesson.provider;
        });
    }, [lessonHistories]);

    return (
        <Layout title="User" description={`${user}, user`} header={user}>
            {typeof window !== 'undefined' ? renderScoreHistory(lessonHistories, communityScores) : null}
        </Layout>
    )
};

export default User;

const renderScoreHistory = (lessonHistories, communityScores) => {    

    if(!lessonHistories) return;

    const lessonList = lessonHistories.filter(lesson => lesson.total !== null).map(lesson => {
           return (
            !lesson.scores ? null :
            <li>
                <Accordion lesson={lesson}>
                    <Link href={`/providers/${lesson.provider}/lessons/${lesson.slug}?type=questions`}>
                        <a>Take the test again</a>
                    </Link>
                    <div><span>{`Your lesson score was ${Math.round((lesson.correct / lesson.total) * 100)}%.`}</span></div>           
                    { !communityScores ? null : <div><span>{`The average lesson score was ${communityScores.lessonScores.average}%.`}</span></div> }
                    <ul>
                    {
                        lesson.scores.map(score => {

                            const communityQuestionScores = communityScores ? communityScores.questionScores.find(qs => qs.text === score.text) : null;
                            const communityQuestionAverage = communityQuestionScores ? Math.round((communityQuestionScores.correct / communityQuestionScores.total) * 100) : null;

                            return (
                                <>                                
                                <li class={styles.markedAnswers}>
                                    <div class={styles.q}><span>Question</span><span>{score.text}</span></div>
                                    <div class={styles.a}><span>Answer</span><span>{score.answers.map(answer => <span>{answer}</span>)}</span></div>
                                    <div class={`${styles.score}`}>
                                        <span>{score.correct}/{score.total}</span>
                                        <span class={`${score.correct === score.total ? styles.isCorrect : styles.isIncorrect}`}></span>
                                        { !communityQuestionScores ? null : <span>{`${communityQuestionAverage}% of participants answered correctly.`}</span> }
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
