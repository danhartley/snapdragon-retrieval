// import { useState } from 'preact/hooks';
import { enums } from 'components/enums';
import styles from 'components/multiple-choice/multiple-choice.module.scss';

export const MultipleChoice = ({_lesson, checkAnswers, type}) => {

    // const [response, setResponse] = useState(null);

    const lesson = _lesson || {};

    const answer = lesson.answer || "25";

    const answers = lesson.answers ? [ ...lesson.answers, lesson.answer ] : [
        "10", "25", "45", "60"
    ];

    const unit = lesson.unit ? `1${lesson.unit}` : "1%";

    const handleCheckAnswers = (response) => {
        lesson.response = response;
    };

    let selection;

    var style = `--value:${answer};--unit:${unit}` as any;

    switch(type) {
        case enums.MULTIPLE_CHOICE_TYPE.PIE:
            const options = answers.map(answer => {
                return <button onClick={e => handleCheckAnswers(answer)} class={styles.pie} style={style}></button>;
            });
            selection = <section class={styles.container}>{ options }</section>;
            break;
        case enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS:
            const listItems = answers.map(answer => {
                return <li key={answer} class={styles.rbList}>
                <input onClick={e => handleCheckAnswers(answer)} type="radio" id={answer} name="answer" value={answer} />
                <label htmlFor={answer}>
                    <span>{answer}</span>
                </label>
            </li>
            });
            selection = <ul>{listItems}</ul>;
    }

    return (
        <>{selection}</>
    )
};