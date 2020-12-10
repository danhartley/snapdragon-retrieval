import { useState, useRef, useEffect, useReducer } from "preact/hooks";
import { logic } from 'logic/logic';
import { enums } from 'components/enums';
import { RankedList } from 'components/list/list';

import styles from 'components/question/question.module.scss';

export const Question = ({lesson}) => {

    if(!lesson.questions) return;

    const PLACEHOLDER = '---';
    const INITIAL_QUESTION = 1;

    const [question, setQuestion] = useState(lesson.questions[INITIAL_QUESTION]);
    const [list, setList] = useState(logic.getPlaceholders(question.listCount, PLACEHOLDER));
    const [testState, setTestState] = useState(enums.TEST_STATE.RUNNING);
    const [score, setScore] = useState({total: 0, correct: 0});

    const inputRef = useRef(null);
    const btnMarkRef = useRef(null);
    const btnNextRef = useRef(null);

    const resetInput = () => {
        if(inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    };

    const addToList = e => {
        const entry = { name: e.target.value, state: enums.TRILEAN.UNKNOWN };
        if(entry.name === '') return;
        const updatedList = logic.updateList(question, list, entry, PLACEHOLDER);
        if(updatedList.filter(l => l.name !== PLACEHOLDER).length === question.listCount) {
            setTestState(enums.TEST_STATE.COMPLETED);
        }
        setList(updatedList);
    };

    const removeFromList = e => {
        const entry = e.target.innerText;
        setList([ ...list.filter(item => item.name !== entry), { name: PLACEHOLDER, state: enums.TRILEAN.UNKNOWN } ]);
        resetInput();
    };

    const checkAnswers = e => {
        const scores = logic.mark({ question, list })
        setList(scores);
        setTestState(enums.TEST_STATE.MARKED);
        setScore({ total: score.total++, correct: scores.isCorrect ? score.correct++ : score.correct });
    };

    const nextTest = e => {
        e.preventDefault();
        const index = logic.next(enums.DIRECTION.Next, lesson.questions.indexOf(question), lesson.questions.length);
        setQuestion(lesson.questions[index]);
        setTestState(enums.TEST_STATE.RUNNING);
        setList(getPlaceholders(lesson.questions[index].listCount));
    }; 

    useEffect(() => {
        window.addEventListener("keydown", e => {                 
            const target = e.target as HTMLButtonElement;
            if(target.type === 'submit') return;
            switch(e.code) {                
                case 'Enter':
                    const updatedList = logic.updateList(question, list, { name: inputRef.current.value, state: enums.TRILEAN.UNKNOWN }, PLACEHOLDER);
                    setList(updatedList);
                    break;
                default:
                    break;
            }
        });
    });

    const listItems = list.map(item => { 
        return <li 
                class={item.name !== PLACEHOLDER 
                    ? item.state === enums.TRILEAN.TRUE 
                        ? item.isOrdered === enums.TRILEAN.TRUE 
                            ? `${styles.correct} ${styles.correctOrder}`
                            : styles.correct
                        : item.state === enums.TRILEAN.FALSE 
                            ? styles.incorrect 
                            : '' 
                    : ''} 
                onClick={e => removeFromList(e)}
            >{item.name}</li> 
    });

    setTimeout(() => {
        resetInput();
        if(testState === enums.TEST_STATE.COMPLETED) btnMarkRef.current.focus();
        if(testState === enums.TEST_STATE.MARKED) btnNextRef.current.focus();
    });

    return (
        <div class={styles.questions}>
            <section>
                <span>{question.text}</span>        
                <input disabled={list.filter(l => l.name !== PLACEHOLDER).length === question.listCount} ref={inputRef} type="text" onBlur={e => addToList(e)} placeholder="" />
                <ul class={styles.answers}>{listItems}</ul>
                <button ref={btnMarkRef} onClick={checkAnswers} disabled={testState !== enums.TEST_STATE.COMPLETED}>Check answers</button>      
                <button ref={btnNextRef} disabled={testState !== enums.TEST_STATE.MARKED} onClick={nextTest}>Next test</button>
            </section>
            <section>{ testState === enums.TEST_STATE.MARKED ? <RankedList items={question.items} unit={question.unit} /> : null }</section>
            <section class={styles.source}>
                <div><a href={lesson.source} target="_blank">Open source in a new tab</a></div>
                <div>Source: {lesson.author}</div>
            </section>
        </div>
    )
};