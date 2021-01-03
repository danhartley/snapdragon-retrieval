import { useState } from 'preact/hooks';

import styles from 'components/accordion/accordion.module.scss';

const Accordion = ({lesson, children}) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleOnClick = e => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button class={styles.title} onClick={e => handleOnClick(e)}>{lesson.title}</button>
            <div>
                <div class={isOpen ? styles.visible : styles.invisible}>{children}</div>
            </div>
        </>
    )
};

export default Accordion;