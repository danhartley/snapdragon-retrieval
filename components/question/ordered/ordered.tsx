import { useState, useRef, useEffect } from "preact/hooks";
import { logic } from 'logic/logic';
import { enums } from 'components/enums';

import styles from 'components/question/question.module.scss';

const OrderedSelections = ({question, testState, type, PLACEHOLDER, markTest, setTestState}) => {

    const [answerList, setAnswerList] = useState(logic.getPlaceholders(question.listCount, PLACEHOLDER));

    const inputRef = useRef(null);
    const btnMarkRef = useRef(null);

    const resetInput = () => {
        if(inputRef.current) {
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    };

    const addToList = e => {
        const entry = { name: e.target.value, state: enums.TRILEAN.UNKNOWN };
        if(entry.name === '') return;
        const updatedAnswerList = logic.updateAnswerList(question, answerList, entry, PLACEHOLDER);
        if(updatedAnswerList.filter(l => l.name !== PLACEHOLDER).length === question.listCount) {
            setTestState(enums.QUESTION_STATE.COMPLETED);
        }
        setAnswerList(updatedAnswerList);
    };

    const removeFromList = e => {
        const entry = e.target.innerText;
        setAnswerList([ ...answerList.filter(item => item.name !== entry), { name: PLACEHOLDER, state: enums.TRILEAN.UNKNOWN } ]);
        resetInput();
    };

    const style = logic.calculateWidth(question.items, 'name');

    const listItems = answerList.map((item, index) => { 
        return <li 
                style={style}
                key={`${index}_${item.name}`}                
                onClick={e => removeFromList(e)}>
                <span
                    class={item.name !== PLACEHOLDER 
                        ? item.state === enums.TRILEAN.TRUE 
                            ? item.isOrdered === enums.TRILEAN.TRUE 
                                ? `${styles.correct} ${styles.correctOrder}`
                                : `${styles.correct}`
                            : item.state === enums.TRILEAN.FALSE 
                                ? `${styles.incorrect}`
                                : ``
                        : ''} 
                >{item.name}</span><span>{item.correct}</span></li> 
    });

    setTimeout(() => {
        resetInput();
    });

    useEffect(() => {
        window.addEventListener("keydown", e => {                 
            const target = e.target as HTMLButtonElement;          
            if(target.type === 'submit' || !inputRef.current || (inputRef.current && inputRef.current.value === "")) return;
            switch(e.code) {                
                case 'Enter':              
                    const updatedAnswerList = logic.updateAnswerList(question, answerList, { name: inputRef.current.value, state: enums.TRILEAN.UNKNOWN }, PLACEHOLDER);
                    setAnswerList(updatedAnswerList);
                    break;
                default:
                    break;
            }
        });
    });

    useEffect(() => {
        setAnswerList(logic.getPlaceholders(question.listCount, PLACEHOLDER));
    },[question.text]);

    const handleCheckAnswer = e => {
        e.preventDefault();
        const score = logic.mark({ question, answerList }, PLACEHOLDER);
        setAnswerList(score.markedAnswerList);
        markTest(score);
    };

    setTimeout(() => {
        if(testState === enums.QUESTION_STATE.COMPLETED) btnMarkRef.current ? btnMarkRef.current.focus() : null;
    });

    return (
        <>
        <section class={styles.container}>
            <input disabled={answerList.filter(l => l.name !== PLACEHOLDER).length === question.listCount} ref={inputRef} type="text" onBlur={e => addToList(e)} placeholder="" />
            <ul class={styles.answers}>{listItems}</ul>
        </section>
        <button ref={btnMarkRef} onClick={handleCheckAnswer} class={testState !== enums.QUESTION_STATE.COMPLETED ? styles.hidden : null}>Check answer</button>
        </>
    )
};

export default OrderedSelections;