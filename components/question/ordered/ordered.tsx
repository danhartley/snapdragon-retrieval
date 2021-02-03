import { useState, useRef, useEffect } from "preact/hooks";
import { logic } from 'logic/logic';
import { enums } from 'components/enums';

import styles from 'components/question/question.module.scss';

const OrderedSelections = ({question, testState, type, PLACEHOLDER, markTest, setTestState}) => {

    const [answerList, setAnswerList] = useState(() => logic.getPlaceholders(question, PLACEHOLDER));

    const inputRef = useRef(null);
    const btnMarkRef = useRef(null);

    const handleSetAnswerList = (answer, answerList) => {         
        
        if(answer.name === '') return;
        
        const updatedAnswerList = logic.updateAnswerList(question, answerList, answer, PLACEHOLDER);
        
        if(updatedAnswerList.filter(l => l.name !== PLACEHOLDER).length === question.listCount) {
            setTestState(enums.QUESTION_STATE.ANSWERED);
        }
        setAnswerList(updatedAnswerList);
    };

    const addToList = e => {
        const answer = { name: e.target.value, state: enums.TRILEAN.UNKNOWN };
        handleSetAnswerList(answer, answerList);
    };

    const removeFromList = e => {
        const entry = logic.toCase(e.target.innerText);
        setAnswerList([ ...answerList.filter(item => logic.toCase(item.name) !== entry), { name: PLACEHOLDER, state: enums.TRILEAN.UNKNOWN } ]);
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
                >{logic.toCase(item.name)}</span><span>{logic.toCase(item.correct)}{(answerList.length === 1 && item.correct) ? logic.unitDisplay(question.unit) || null : null }</span></li> 
    });

    const handleOnKeyDown = e => {
        const target = e.target as HTMLButtonElement;
            if(target.type === 'submit' || !inputRef.current || (inputRef.current && inputRef.current.value === "")) return;
            switch(e.code) {        
                case 'Enter':
                    handleSetAnswerList({ name: inputRef.current.value, state: enums.TRILEAN.UNKNOWN }, answerList);
                    break;
                default:
                    break;
            }
    };

    useEffect(() => {
        setAnswerList(logic.getPlaceholders(question, PLACEHOLDER));
    },[question.text]);

    useEffect(() => {
        if(btnMarkRef.current) {                
            if(testState === enums.QUESTION_STATE.ANSWERED) {
                btnMarkRef.current.disabled = false;
                btnMarkRef.current.focus();
                // console.log('btnMarkRef: ', document.activeElement);
            }
        }
    }, [testState]);

    useEffect(() => {
        if(testState === enums.QUESTION_STATE.RUNNING) {
            if(inputRef.current) {
                let input = inputRef.current as HTMLInputElement;
                    input.value = '';
                    input.focus();
                // console.log('inputRef: ', document.activeElement);
            }
        }
    },[answerList])

    const handleCheckAnswer = e => {
        e.preventDefault();
        const score = logic.mark({ question, answerList }, PLACEHOLDER);
        setAnswerList(score.markedAnswerList);
        markTest(score);
    };

    let isMarkBtnVisible = true, isMarkBtnDisabled = false;
    
    switch(testState) {
        case enums.QUESTION_STATE.RUNNING:
            isMarkBtnVisible = true;
            isMarkBtnDisabled = listItems.length > answerList.filter(a => a.name !== PLACEHOLDER).length;
            break;
        case enums.QUESTION_STATE.ANSWERED:
            isMarkBtnVisible = true;                                
            isMarkBtnDisabled = false;         
            break;
        case enums.QUESTION_STATE.MARKED:
            isMarkBtnVisible = false;
            isMarkBtnDisabled = false;
            break;
        case enums.QUESTION_STATE.LESSON_OVER:
            isMarkBtnVisible = false;
            isMarkBtnDisabled = false;
            break;
    }

    console.log(document.activeElement);
    

    return (
        <>
        <section class={styles.container}>
            <input id="orderedTextInput" disabled={answerList.filter(l => l.name !== PLACEHOLDER).length === question.listCount} ref={inputRef} type="text" onBlur={e => addToList(e)} placeholder="" onKeyDown={e => handleOnKeyDown(e)} />
            <label htmlFor="orderedTextInput"></label>
            <ul class={styles.answers}>
                {listItems}
                {
                !question.workings 
                    ? null
                    : testState === enums.QUESTION_STATE.ANSWERED
                        ? <li>{question.workings}</li>
                        : null
            }
            </ul>
        </section>
        <button id="btnMarkId" ref={btnMarkRef} onClick={handleCheckAnswer} class={isMarkBtnVisible ? null : styles.hidden} disabled={isMarkBtnDisabled}>Check answer</button>
        </>
    )
};

export default OrderedSelections;