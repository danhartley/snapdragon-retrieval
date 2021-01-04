import { useState, useRef } from "preact/hooks";
import { logic } from 'logic/logic';
import { useLocalStorageState } from 'api/state';
import { enums } from 'components/enums';
import MultipleChoice from 'components/question/multiple-choice/multiple-choice';
import MultipleSelect from 'components/question/multiple-select/multiple-select';
import OrderedSelections from 'components/question/ordered/ordered';
import Sources from 'components/question/source';

import styles from 'components/question/question.module.scss';

export const Question = ({lesson, testState, setTestState, progress, setProgress}) => {

    if(!lesson.questions) return;

    const PLACEHOLDER = '---';
    const INITIAL_QUESTION = 0;

    const [question, setQuestion] = useState(lesson.questions[INITIAL_QUESTION]);
    const [LessonHistories, setLessonHistories] = useLocalStorageState(null, enums.STORAGE_KEY.HISTORY);
    const [score, setScore] = useState({total: 0, correct: 0, answered: 0, skipped: 0, isLessonOver: false});

    const btnNextRef = useRef(null);

    const markTest = ({total, correct, text, answers, type, unit}) => {
        setTestState(score.answered + 1 === lesson.questions.length ? enums.QUESTION_STATE.COMPLETED : enums.QUESTION_STATE.MARKED);
        setLessonHistories({total, correct, text, answers, type, unit, title: lesson.title }, enums.STORAGE_KEY.HISTORY);
        setScore({ ...score, total: score.total + total, correct: score.correct + correct, answered: score.answered + 1, isLessonOver: score.answered + 1 === lesson.questions.length });
    };

    const nextTest = e => {
        e.preventDefault();
        const index = logic.next(enums.DIRECTION.Next, lesson.questions.map(q => q.text).indexOf(question.text), lesson.questions.length);    
        setQuestion(lesson.questions[index]);
        setTestState(enums.QUESTION_STATE.RUNNING);
        setProgress({ ...progress, number: progress.number + 1});
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
            format = <MultipleChoice setQuestion={setQuestion} question={question} type={question.unit === "%" ? enums.MULTIPLE_CHOICE_TYPE.PIE : enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS} PLACEHOLDER={PLACEHOLDER} markTest={(score) => markTest(score)} />
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
        case enums.QUESTION_STATE.COMPLETED:
            isNextBtnVisible = question.type === enums.QUESTION_TYPE.MULTIPLE_CHOICE;
            isNextBtnDisabled = true;
            break;
        case enums.QUESTION_STATE.MARKED:
            isNextBtnVisible = true;
            isNextBtnDisabled = score.isLessonOver;
            break;
    }

    return (
        <div class={styles.questions}>
            <section>
                <div class={styles.text}>
                    <span class={styles.cue}></span>
                    <span><span>{question.text}</span><span class="super">{`${progress.number}/${progress.of}`}</span></span>
                    <span class={`${styles.liveScore} ${score.total === 0 ? styles.hidden : null} ${lesson.availableCount === score.total ? styles.lessonOver : null } `}><span>{score.correct}</span><span>{score.total}</span></span>
                </div> 
                <>{format}</>
                <div class={styles.flex}>
                <button class={isNextBtnVisible ? null : styles.hidden} ref={btnNextRef} onClick={nextTest} disabled={isNextBtnDisabled}>
                    {score.isLessonOver ? `Lesson over` : `Next question`}
                </button>
                </div>
            </section>
            <Sources sources={question.sources} />          
        </div>
    )
};