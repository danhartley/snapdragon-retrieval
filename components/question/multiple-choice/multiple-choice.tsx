import { useState, useEffect } from "preact/hooks";
import { enums } from 'components/enums';
import { logic } from 'logic/logic';
import styles from 'components/question/multiple-choice/multiple-choice.module.scss';

const MultipleChoice = ({question, type, PLACEHOLDER, markTest, setQuestion}) => {

    const [answerList, setAnswerList] = useState(logic.getPlaceholders(question.listCount, PLACEHOLDER));

    question.items = question.items || logic.sortBy(logic.shuffleArray([ ...question.answers.map(a => { return { name: a } }), { name: question.answer } ]), "name");

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
        const score = logic.mark({ question }, PLACEHOLDER);
        markTest(score);
    };

    let format;
    
    switch(type) {
        case enums.MULTIPLE_CHOICE_TYPE.PIE:
            const options = question.items.map(answer => {
                const style = `--value:${answer.name}; --unit:1${question.unit};` as any;
                const css = answer.state === enums.TRILEAN.TRUE 
                            ? styles.correct 
                            : answer.state === enums.TRILEAN.FALSE 
                                ? styles.incorrect 
                                : answer.name === question.answer && answer.state === enums.TRILEAN.UNKNOWN
                                    ? styles.correctAnswer
                                    : null;
                return  <li class={styles.pie}>
                            <button onClick={e => handleCheckAnswers(answer.name)} class={`${styles.pie} ${css}`} style={style} >
                                <span>{answer.name}</span>
                            </button>
                            <span class={css}></span>
                        </li>;
            });            
            format = <ul class={question.response ? styles.disableOverlay : null}>{options}</ul>
            break;
        case enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS:
            const listItems = question.items.map(answer => {
                const isCorrect = answer.state 
                                    ? answer.state === enums.TRILEAN.TRUE 
                                        ? styles.correct 
                                        : answer.state === enums.TRILEAN.FALSE 
                                            ? styles.incorrect 
                                            : answer.name === question.answer && answer.state === enums.TRILEAN.UNKNOWN
                                                ? styles.correctAnswer
                                                : null
                                    : null;
                return <li key={answer.name} class={`${styles.rbList} ${isCorrect}`}>
                        <input onClick={e => handleCheckAnswers(answer.name)} type="radio" id={answer.name} name="answer" value={answer.name} />
                        <label htmlFor={answer.name}>
                            <span>{answer.name}</span><span>{question.unit ?? ''}</span>
                        </label>
                      </li>
            });;
            format = <ul class={question.response ? styles.disableOverlay : null}>{listItems}</ul>
            break;
    }

    useEffect(() => {
        setAnswerList(logic.getPlaceholders(question.listCount, PLACEHOLDER));
    },[question.text]);

    return (
        <section class={styles.container}>            
            {format}
        </section>
    )
};

export default MultipleChoice;