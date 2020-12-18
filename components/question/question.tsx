import { useState, useRef } from "preact/hooks";
import { logic } from 'logic/logic';
import { useLocalStorageState } from 'api/state';
import { enums } from 'components/enums';
import { MultipleChoice } from 'components/question/multiple-choice/multiple-choice';
import { OrderedSelections } from 'components/question/ordered/ordered';

import styles from 'components/question/question.module.scss';

export const Question = ({lesson}) => {

    lesson.questions = logic.shuffleArray(lesson.questions);

    if(!lesson.questions) return;

    const PLACEHOLDER = '---';
    const INITIAL_QUESTION = 0;

    const [question, setQuestion] = useState(lesson.questions[INITIAL_QUESTION]);
    const [testState, setTestState] = useState(enums.QUESTION_STATE.RUNNING);
    const [history, setHistory] = useLocalStorageState(null, enums.STORAGE_KEY.HISTORY);
    const [progress, setProgress] = useState({ number: 1, of: lesson.questions.length });

    const btnNextRef = useRef(null);
    const btnSkipRef = useRef(null);

    const skipTest = e => {
        e.preventDefault();
        const index = logic.next(enums.DIRECTION.Next, lesson.questions.indexOf(question), lesson.questions.length);
        setQuestion(lesson.questions[index]);
        setProgress({ ...progress, number: progress.number === lesson.questions.length ? 1 : progress.number + 1 });
    };

    const nextTest = e => {
        e.preventDefault();
        const index = logic.next(enums.DIRECTION.Next, lesson.questions.indexOf(question), lesson.questions.length);
        setQuestion(lesson.questions[index]);
        setTestState(enums.QUESTION_STATE.RUNNING);
        setProgress({ ...progress, number: progress.number + 1});
    };

    const completeTest = score => {
        setTestState(enums.QUESTION_STATE.MARKED);
        setHistory({...score, lessonTitle: lesson.title}, enums.STORAGE_KEY.HISTORY);
    };

    setTimeout(() => {
        if(testState === enums.QUESTION_STATE.MARKED) btnNextRef.current ? btnNextRef.current.focus() : null;
    });

    let format;

    switch(question.type) {
        case enums.QUESTION_TYPE.ORDERED:
        case enums.QUESTION_TYPE.UNORDERED:
            format = <OrderedSelections question={question} testState={testState} type={question.type} PLACEHOLDER={PLACEHOLDER} completeTest={(score) => completeTest(score)} setTestState={setTestState} />
            break;
        case enums.QUESTION_TYPE.MULTIPLE_CHOICE:
            format = <MultipleChoice setQuestion={setQuestion} question={question} type={enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS} completeTest={(score) => completeTest(score)} />
            break;
    }

    return (
        <div class={styles.questions}>
            <section>
                <div class={styles.text}>
                    <span class={styles.cue}></span>
                    <span><span>{question.text}</span><span class="super">{`${progress.number}/${progress.of}`}</span></span>
                </div> 
                <>{format}</>
                <div class={styles.flex}>
                    <button class={testState !== enums.QUESTION_STATE.MARKED ? styles.hidden : null} ref={btnNextRef} onClick={nextTest}>Next question</button>
                    <button class={testState === enums.QUESTION_STATE.MARKED ? styles.hidden : null} ref={btnSkipRef} onClick={skipTest}>Skip question</button>
                </div>
            </section>
            <section class={styles.source}>
                <div><a href={lesson.source} target="_blank">Open source in a new tab</a></div>
                <div>Source: {lesson.provider}</div>
            </section>
        </div>
    )
};