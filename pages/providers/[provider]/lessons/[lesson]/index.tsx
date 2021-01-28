import { useState } from "preact/hooks";
import { useRouter } from 'next/router';
import { getLessons } from 'api/lessons/utils';
import { logic } from 'logic/logic';
import Layout from 'components/layout/layout';
import { Card } from 'components/card/card';
import { Question } from 'components/question/question';
import QueryString from 'components/query-string/query-string';
import { enums } from "components/enums";

const Lesson = ({lesson}) => {

    const [testState, setTestState] = useState(enums.QUESTION_STATE.RUNNING);
    const [progress, setProgress] = useState({ number: 1, of: lesson.questions.length });
    const [score, setScore] = useState({total: 0, correct: 0, answered: 0, skipped: 0, isLessonOver: false});

    const router = useRouter();

    const provider = router.query.provider;
    const type = router.query.type;
    const disableNavigation = (testState !== enums.QUESTION_STATE.ANSWERED && type === enums.LESSON_TYPE.QUESTIONS) && progress.number > 1;
  
    return (
        <Layout title="Lesson" description={`${provider} ${lesson.title} lesson`} header={lesson.title} headerLink={lesson.source} disableNavigation={disableNavigation} score={score} >
            <div>
                <QueryString options={enums.LESSON_TYPE} lesson={lesson} />
                { type === enums.LESSON_TYPE.CARDS 
                    ? <Card lesson={lesson}></Card> 
                    : <Question lesson={lesson} testState={testState} setTestState={setTestState} progress={progress} setProgress={setProgress} score={score} setScore={setScore}></Question> }
            </div>
        </Layout>
    )
};

export default Lesson;

export async function getStaticProps({params: {provider, lesson}}) {    

    const providerLesson = { ...getLessons().find(l => l.provider === provider && l.slug === lesson), availableCount: 0 }; 

    const ranked = providerLesson.ranked ? providerLesson.ranked.map(r => {
        providerLesson.availableCount += (r.listCount * 2);
        return r;
    }) : [];
    const unranked = providerLesson.unranked 
        ? providerLesson.unranked.map(u => { 
            providerLesson.availableCount += u.listCount;
            return { ...u, type: u.type || enums.QUESTION_TYPE.UNORDERED } 
        }) 
        : [];
    const multipleChoice = providerLesson.multiplechoice
        ? providerLesson.multiplechoice.map(m => { return { ...m, type: m.type || enums.QUESTION_TYPE.MULTIPLE_CHOICE } })
        : [];
    const multipleSelect = providerLesson.multipleselect
        ? providerLesson.multipleselect.map(m => { 
            providerLesson.availableCount += m.answers.length;
            return { ...m, type: m.type || enums.QUESTION_TYPE.MULTIPLE_SELECT } 
        }) 
        : [];

    providerLesson.questions = logic.sortBy([ ...multipleChoice, ...unranked, ...multipleSelect, ...ranked ], 'index');

    providerLesson.availableCount += multipleChoice.length;

    return {
      props: {
        lesson: providerLesson
      },
    }
}

export async function getStaticPaths() {

    const paths = getLessons().map(lesson => {
        return { params: { provider: lesson.provider, lesson: lesson.slug }}
    });

    return { paths, fallback: false }
}