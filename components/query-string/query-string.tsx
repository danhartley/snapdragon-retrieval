import { useRouter } from 'next/router';

import styles from 'components/query-string/query-string.module.scss';
import { enums } from 'components/enums';
import { useState } from 'preact/hooks';

const QueryString = ({options, lesson}) => {

    // have choice of presentation
    
    const router = useRouter();
    const [type, setType] = useState(router.query.type);

    const changeOption = (type => {
        router.push({
            pathname: `/providers/${router.query.provider}/lessons/${router.query.lesson}`,
            query: { type },
          })
          setType(type);
    });
    
    const optionList = Object.keys(options).map(key => 
        <li class={styles.rbList}>
        <input onClick={() => changeOption(options[key])} type="radio" id={options[key]} name="type" value={options[key]} checked={options[key] === type} />
            <label htmlFor={options[key]}>
                <span>{options[key]}</span>
                <span class="super">{options[key] === enums.LESSON_TYPE.FLASHCARDS ? lesson.cards.length : lesson.questions.length}</span>
            </label>
        </li>
        // <li><button class="rbList" onClick={e => changeOption(options[key])}>{options[key]}</button></li>
    );

    // const optionList = Object.keys(options).map(key => <li><button class="card" onClick={e => changeOption(options[key])}>{options[key]}</button></li>);

    return (
        <ul class={styles.navButtons}>{optionList}</ul>
    )
};

export default QueryString;