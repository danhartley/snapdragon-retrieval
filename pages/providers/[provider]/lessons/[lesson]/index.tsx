import { useState, useEffect } from "preact/hooks";
import { api } from 'api/api';
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

    const router = useRouter();

    const provider = router.query.provider;
    const type = router.query.type;
    const disableNavigation = (testState !== enums.QUESTION_STATE.COMPLETED && type === enums.LESSON_TYPE.QUESTIONS) && progress.number > 1;
    
    useEffect(() => {        

        if(!lesson.questions) return;

        let questions;
        const getQuestions = async () => {

            
            const response = await api.getQuestionsByLesson(lesson) as Array<any>;
            
            questions = response.map(r => r.length > 0 ? r : null).filter(r => r);

            console.log('questions:', questions)

            if(questions.length === 0) {                
                questions = await api.createQuestions(lesson);
            }            

            console.log('questions:', questions)
        };
        
        const getLesson = async () => {
            let _lesson = await api.getLessonByTitle(lesson.title) as any;            
            if(_lesson && _lesson.data && _lesson.data.length > 0) {
                getQuestions();                
            } else {
                _lesson = await api.createLesson(lesson.title);
            }
        };

        getLesson();
    },[]);
  
    return (
        <Layout title="Lesson" description={`${provider} ${lesson.title} lesson`} header={lesson.title} headerLink={lesson.source} disableNavigation={disableNavigation} >
            <div>
                <QueryString options={enums.LESSON_TYPE} lesson={lesson} />
                { type === enums.LESSON_TYPE.CARDS 
                    ? <Card lesson={lesson}></Card> 
                    : <Question lesson={lesson} testState={testState} setTestState={setTestState} progress={progress} setProgress={setProgress}></Question> }
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

    providerLesson.questions = logic.shuffleArray([ ...ranked, ...unranked, ...multipleChoice, ...multipleSelect ]);

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