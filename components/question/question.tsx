import { useState, useRef, useEffect } from "preact/hooks";
import { logic } from 'logic/logic';
import { useLocalStorageState, getScore } from 'api/state';
import { enums } from 'components/enums';
import MultipleChoice from 'components/question/multiple-choice/multiple-choice';
import OrderedSelections from 'components/question/ordered/ordered';

import styles from 'components/question/question.module.scss';

export const Question = ({lesson}) => {

    if(!lesson.questions) return;

    const PLACEHOLDER = '---';
    const INITIAL_QUESTION = 0;

    const [question, setQuestion] = useState(lesson.questions[INITIAL_QUESTION]);
    const [testState, setTestState] = useState(enums.QUESTION_STATE.RUNNING);
    const [history, setHistory] = useLocalStorageState(null, enums.STORAGE_KEY.HISTORY);
    const [progress, setProgress] = useState({ number: 1, of: lesson.questions.length });
    const [score, setScore] = useState({total: 0, correct: 0, answered: 0, skipped: 0, isLessonOver: false});

    const btnNextRef = useRef(null);
    const btnSkipRef = useRef(null);

    const skipTest = e => {
        e.preventDefault();
        const index = logic.next(enums.DIRECTION.Next, lesson.questions.indexOf(question), lesson.questions.length);
        setQuestion(lesson.questions[index]);
        setProgress({ ...progress, number: progress.number === lesson.questions.length ? 1 : progress.number + 1 });
        setScore({ ...score, answered: score.answered + 1, skipped: score.skipped + 1, isLessonOver: score.answered + 1 === lesson.questions.length });
    };

    const markTest = currentScore => {
        setTestState(enums.QUESTION_STATE.MARKED);
        setHistory({...currentScore, lessonTitle: lesson.title}, enums.STORAGE_KEY.HISTORY);
        setScore({ ...score, total: score.total + getScore(currentScore).total, correct: score.correct + getScore(currentScore).correct, answered: score.answered + 1, isLessonOver: score.answered + 1 === lesson.questions.length });
    };

    const nextTest = e => {
        e.preventDefault();
        const index = logic.next(enums.DIRECTION.Next, lesson.questions.indexOf(question), lesson.questions.length);
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
            format = <MultipleChoice setQuestion={setQuestion} question={question} type={enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS} PLACEHOLDER={PLACEHOLDER} markTest={(score) => markTest(score)} />
            break;
    }

    return (
        <div class={styles.questions}>
            <section>
                <div class={styles.text}>
                    <span class={styles.cue}></span>
                    <span><span>{question.text}</span><span class="super">{`${progress.number}/${progress.of}`}</span></span>
                    <span class={`${styles.liveScore} ${score.total === 0 ? styles.hidden : null} `}><span>{score.correct}</span><span>{score.total}</span></span>
                </div> 
                <>{format}</>
                <div class={styles.flex}>
                    <button class={testState !== enums.QUESTION_STATE.MARKED ? styles.hidden : null} ref={btnNextRef} onClick={nextTest} disabled={score.isLessonOver}>
                        {score.isLessonOver ? `Lesson over` : `Next question`}
                    </button>
                    <button class={testState === enums.QUESTION_STATE.MARKED || testState === enums.QUESTION_STATE.COMPLETED ? styles.hidden : null} ref={btnSkipRef} onClick={skipTest}>Skip question</button>
                </div>
            </section>
            <section class={styles.source}>
                <div><a href={lesson.source} target="_blank">Additional source (opens in a new tab)</a></div>
                <div>Source: {lesson.provider}</div>
            </section>
        </div>
    )
};