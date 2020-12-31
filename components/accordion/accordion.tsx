import { useState, useEffect, useRef } from 'preact/hooks';

import styles from 'components/accordion/accordion.module.scss';

const Accordion = ({lesson}) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleOnClick = e => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button class={styles.title} onClick={e => handleOnClick(e)}>{lesson.title}</button>
            <div>
                <div class={isOpen ? styles.visible : styles.invisible}>
                    <div>total: {lesson.total}</div>
                    <div>correct: {lesson.correct}</div>
                    <ul>
                    {
                        lesson.scores.map(score => {
                            return (
                                <li>
                                    <div>{score.text}</div>
                                    <div>{score.answers.map(answer => <span>{answer}</span>)}</div>
                                    <div>{score.correct}/{score.total}</div>
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
            </div>
        </>
    )

};

export default Accordion;