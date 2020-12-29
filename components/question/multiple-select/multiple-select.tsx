import { useState } from "preact/hooks";
import { enums } from 'components/enums';
import { logic } from 'logic/logic';

import styles from 'components/question/multiple-select/multiple-select.module.scss';

const MultipleSelect = ({question, markTest, setQuestion, testState}) => {

    const [checkedAnswers,setCheckedAnswers] = useState([]);
    const [items, setItems] = useState(logic.sortBy(logic.shuffleArray([ 
        ...question.answers.map(a => { return { name: a } }), 
        ...question.alternatives.map(a => { return { name: a } })
    ]), "name"));

    let alternatives, css;

    const listItems = items.map(answer => {
        css = answer.state === enums.TRILEAN.TRUE ? styles.correct : answer.state === enums.TRILEAN.FALSE ? styles.incorrect : null;
        return <li key={answer.name} class={`${styles.chkBoxList} ${css}`}>
            <input type="checkbox" onChange={e => handleCheckBox(answer.name)} id={answer.name} name="answer" value={answer.name} />
            <label htmlFor={answer.name}>
                <span>{answer.name}</span><span>{question.unit ?? ''}</span>
            </label>
        </li>
    });

    alternatives = <ul class={question.response ? styles.disableOverlay : null}>{listItems}</ul>

    const handleCheckBox = answer => {
        checkedAnswers.indexOf(answer) === -1
            ? setCheckedAnswers([...checkedAnswers, answer])
            : setCheckedAnswers(checkedAnswers.filter(a => a !== answer));
    };

    const handleCheckAnswer = e => {
        e.preventDefault();
        const score = logic.markMultipleAnswers({ question: { ...question, items }, checkedAnswers });
        setItems(score.items);
        setQuestion(question);
        markTest(score);
    };

    const className = (testState === enums.QUESTION_STATE.MARKED || testState === enums.QUESTION_STATE.COMPLETED) 
                        ? styles.hidden
                        : checkedAnswers.length === 0 
                            ? styles.hidden 
                            : null;

    return (
        <>
        <section class={styles.container}>            
            {alternatives}
        </section>
        <button onClick={handleCheckAnswer} class={className}>Check answer</button>
        </>
    )
};

export default MultipleSelect;