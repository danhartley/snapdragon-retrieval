import { useRef } from "preact/hooks";
import { enums } from 'components/enums';
import { logic } from 'logic/logic';
import styles from 'components/question/multiple-choice/multiple-choice.module.scss';

export const MultipleChoice = ({question, type, completeTest, setQuestion}) => {

    question.items = question.items || [ ...question.answers.map(a => { return { name: a } }), { name: question.answer } ];

    const handleCheckAnswers = (response) => {
        question.response = response;
        question.items = question.items.map(item => {
            return (response === question.answer && response === item.name)
                ? { ...item, state: enums.TRILEAN.TRUE }
                : response === item.name 
                    ? { ...item, state: enums.TRILEAN.FALSE }
                    : { ...item, state: enums.TRILEAN.UNKNOWN };
        });
        setQuestion(question);
        const score = logic.mark({ question });
        completeTest(score);
    };

    let format;
    
    switch(type) {
        case enums.MULTIPLE_CHOICE_TYPE.PIE:
            var style = `--value:${question.answer};--unit:${question.unit}` as any;
            const options = question.items.map(answer => {
                return <button onClick={e => handleCheckAnswers(answer)} class={styles.pie} style={style}></button>;
            });
            format = { options };
            break;
        case enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS:
            const listItems = question.items.map(answer => {
                const isCorrect = answer.state ? answer.state === enums.TRILEAN.TRUE ? styles.correct : answer.state === enums.TRILEAN.FALSE ? styles.incorrect : null : null;
                return <li key={answer.name} class={`${styles.rbList} ${isCorrect}`}>
                        <input onClick={e => handleCheckAnswers(answer.name)} type="radio" id={answer.name} name="answer" value={answer.name} />
                        <label htmlFor={answer.name}>
                            <span>{answer.name}</span>
                        </label>
                      </li>
            });;
            format = <ul class={question.response ? styles.disableOverlay : null}>{listItems}</ul>
    }

    return (
        <section class={styles.container}>{format}</section>
    )
};