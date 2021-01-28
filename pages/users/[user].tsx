import { useEffect, useState } from 'preact/hooks';
import { useRouter } from 'next/router';
import Layout from 'components/layout/layout';
import Link from 'next/link'
import users from 'pages/users/users.json';
import { getFromLocalStorage } from 'api/state';
import { enums } from 'components/enums';
import { logic } from 'logic/logic';
import { getLessonSummaries } from 'api/api-effects';
import { getLessons } from 'api/lessons/utils';

import providers from 'pages/providers/providers.json';

import Accordion from 'components/accordion/accordion';

import styles from 'pages/users/users.module.scss';

const unitDisplay = score => {
    return score.unit 
            ? score.unit === '%' || score.unit === "°" 
                ? score.unit
                : ` ${score.unit}` 
                : null
};

const Answer = ({score}) => {

    return ( 
        score.answers.length > 1 
            ? <div class={styles.a}>
                    <span>Answer</span>                    
                    <ul>
                        {score.answers.map(answer => <li>{logic.toCase(answer.name || answer)} {answer.value ?? null}{unitDisplay(score)}</li>)}
                    </ul>
                </div>        
            : <>
              <div class={styles.a}>
                <span>Answer</span><span>{score.answers.map(answer => <span>{logic.toCase(answer.name || answer)}{unitDisplay(score)}</span>)}</span>
              </div>
              { score.workings ? <div class={styles.w}><span>Workings</span><span>{score.workings}</span></div> : null }
              </>
        )
}

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
    const [communityScores, setCommunityScores] = useState([]);

    useEffect(() => {
        setLessonHistories(getLessonHistories());
    }, []);

    useEffect(() => {

        if(!lessonHistories) return;

        const _communityScores = [];

        lessonHistories.forEach(async lh => {
            const lesson = lessons.find(l => l.title === lh.title);
            lesson.questions = logic.groupQuestionsAsItems(lesson);
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

            const communityScore = {
                lessonScores : { 
                      ...lessonScores
                    , average: lessonScores.total === 0 ? 100 : Math.round((lessonScores.correct/lessonScores.total)*100) },
                questionScores,
                lessonTitle: lh.title
            }

            _communityScores.push(communityScore);

            setCommunityScores([]);
            setCommunityScores(_communityScores);

            lh.slug = lesson.slug;
            lh.provider = lesson.provider;
        });
    }, [lessonHistories]);

    return (
        <Layout title="User" description={`${user}, user`} header={user === 'anonymous' ? 'Your scores' : user}>
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
                    <div><span>{`Your most recent mark for this lesson was ${Math.round((lesson.correct / lesson.total) * 100)}%.`}</span></div>           
                    { 
                        communityScores.length > 0
                            ? communityScores.find(cs => cs.lessonTitle === lesson.title)
                                ? <div><span>{`The average mark for this lesson is ${communityScores.find(cs => cs.lessonTitle === lesson.title).lessonScores.average}%.`}</span></div> 
                                : null
                            : null 
                    }
                    <ul>
                    {
                        lesson.scores.map((score, index) => {

                            const communityQuestionScores = communityScores.length > 0 
                                ? communityScores.find(cs => cs.lessonTitle === lesson.title)
                                    ? communityScores.find(cs => cs.lessonTitle === lesson.title).questionScores.find(qs => qs.text === score.text) 
                                    : null
                                : null;
                            const communityQuestionAverage = (communityQuestionScores && communityQuestionScores.total) 
                                ? Math.round((communityQuestionScores.correct / communityQuestionScores.total) * 100) 
                                : score 
                                    ? (score.correct / score.total) * 100
                                    : 0;

                            return (
                                <>                                
                                <li class={styles.markedAnswers}>
                                    <div class={styles.q}><span>Question</span><span>{score.text}</span><span>{index + 1}</span></div>
                                    <Answer score={score} />
                                    <div class={`${styles.score}`}>
                                        <span>{score.correct}/{score.total}</span>
                                        <span class={`${score.correct === score.total ? styles.isCorrect : styles.isIncorrect}`}></span>
                                        {console.log(communityQuestionAverage)}
                                        <span>{`${communityQuestionAverage}% of participants answered correctly.`}</span>
                                    </div>                                    
                                </li>
                                </>
                            )
                        })
                    }
                    </ul>
                    <Link href={`/providers/${lesson.provider}/lessons/${lesson.slug}?type=questions`}>
                        <a>Take the test again</a>
                    </Link>
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
