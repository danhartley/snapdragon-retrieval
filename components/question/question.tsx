import { useState, useRef, useEffect } from "preact/hooks";
import { addLessonCommuityState } from 'api/api-effects';
import { logic } from 'logic/logic';
import { useLocalStorageState } from 'api/state';
import { enums } from 'components/enums';
import { api } from 'api/api';
import MultipleChoice from 'components/question/multiple-choice/multiple-choice';
import MultipleSelect from 'components/question/multiple-select/multiple-select';
import OrderedSelections from 'components/question/ordered/ordered';
import Sources from 'components/question/source';
import CommunityScore from 'components/question/community-score/community-score';

import styles from 'components/question/question.module.scss';
import { type } from "os";

export const Question = ({lesson, testState, setTestState, progress, setProgress, score, setScore }) => {

    if(!lesson.questions) return;

    const PLACEHOLDER = '---';
    const INITIAL_QUESTION = 0;
    const COMMUNITY_SCORE = {};

    const [question, setQuestion] = useState(lesson.questions[INITIAL_QUESTION]);
    const [lessonHistories, setLessonHistories] = useLocalStorageState(null, enums.STORAGE_KEY.HISTORY);
    const [communityScore, setCommunityScore] = useState(COMMUNITY_SCORE);

    useEffect(() => {
        setCommunityScore(COMMUNITY_SCORE);
    },[question.text]);

    useEffect(() => {        
        addLessonCommuityState(lesson);
    },[]);

    const btnNextRef = useRef(null);

    const markTest = async ({text, answers, type, unit, isCorrect}) => {

        const total = 1; // each question counts as 1
        const correct = (isCorrect ? 1 : 0); // each question is either correct (1), or wrong (0)
        const isLessonOver = score.answered + 1 === lesson.questions.length;

        setTestState(score.answered + 1 === lesson.questions.length ? enums.QUESTION_STATE.LESSON_OVER : enums.QUESTION_STATE.MARKED);
        setLessonHistories({total, correct, text, answers, type, unit, title: lesson.title, workings: question.workings }, enums.STORAGE_KEY.HISTORY);
        setScore({ ...score, total: score.total + 1, correct: score.correct + correct, answered: score.answered + 1, isLessonOver });
        const updatedQuestion = { 
            ...question
            , total: question.total + 1
            , correct: question.correct + correct
        };
        setCommunityScore({ correct: updatedQuestion.correct, total: updatedQuestion.total, question, userCorrect: correct });
        const response = await api.updateQuestion(updatedQuestion) as any;
        if(response) {  
            // setCommunityScore({ correct: response.data.correct, total: response.data.total, question, userCorrect: correct });
        }
        setProgress({ ...progress, number: isLessonOver ? 0 : progress.number + 1});
    };

    const nextTest = e => {
        e.preventDefault();
        const index = logic.next(enums.DIRECTION.Next, lesson.questions.map(q => q.text).indexOf(question.text), lesson.questions.length);    
        setQuestion(lesson.questions[index]);
        setTestState(enums.QUESTION_STATE.RUNNING);
    };

    setTimeout(() => {
        if(testState === enums.QUESTION_STATE.MARKED) btnNextRef.current ? btnNextRef.current.focus() : null;
    });

    let format;

    switch(question.type) {
        case enums.QUESTION_TYPE.ORDERED:
        case enums.QUESTION_TYPE.UNORDERED:
            format = <OrderedSelections question={question} testState={testState} type={question.type} PLACEHOLDER={PLACEHOLDER} markTest={(score) => markTest(score)} setTestState={setTestState} />
            break;
        case enums.QUESTION_TYPE.MULTIPLE_CHOICE:
            const isSafari = (typeof window !== 'undefined') ? (window.navigator.userAgent.search("Safari") >= 0 && window.navigator.userAgent.search("Chrome") < 0) : false;
            
            let type = question.unit === "%" ? enums.MULTIPLE_CHOICE_TYPE.PIE : enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS;
                type = isSafari ? enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS : type;
            
            format = <MultipleChoice setQuestion={setQuestion} question={question} type={type} PLACEHOLDER={PLACEHOLDER} markTest={(score) => markTest(score)} />
            break;
        case enums.QUESTION_TYPE.MULTIPLE_SELECT:
            format = <MultipleSelect setQuestion={setQuestion} question={question} markTest={(score) => markTest(score)} testState={testState} />
            break;

    }

    let isNextBtnVisible = false, isNextBtnDisabled = false;
    
    switch(testState) {
        case enums.QUESTION_STATE.RUNNING:
            isNextBtnVisible = question.type === enums.QUESTION_TYPE.MULTIPLE_CHOICE;
            isNextBtnDisabled = true;            
            break;
        case enums.QUESTION_STATE.ANSWERED:
            isNextBtnVisible = (question.type === enums.QUESTION_TYPE.MULTIPLE_CHOICE);
            isNextBtnDisabled = true;
            break;
        case enums.QUESTION_STATE.MARKED:
            isNextBtnVisible = true;
            isNextBtnDisabled = score.isLessonOver;
            break;
        case enums.QUESTION_STATE.LESSON_OVER:
            isNextBtnVisible = true;
            isNextBtnDisabled = true;
            break;
    }

    return (
        <div class={styles.questions}>
            <section>
                <div class={styles.text}>
                    <span class={styles.cue}></span>
                    <span><span>{logic.toCase(question.text)}</span><span class="super">{`${progress.number}/${progress.of}`}</span></span>                    
                </div> 
                <>{format}</>
                <div class={styles.flex}>
                <button class={isNextBtnVisible ? null : styles.hidden} ref={btnNextRef} onClick={nextTest} disabled={isNextBtnDisabled}>
                    {score.isLessonOver ? `Lesson over` : `Next question`}
                </button>
                </div>
            </section>
            <CommunityScore data={communityScore} />
            <Sources sources={question.sources} />
        </div>
    )
};