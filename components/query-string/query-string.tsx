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
    
    const activeOptions = Object.keys(options).map(key => {
        return lesson[options[key]] ? options[key] : undefined;
    }).filter(option => option);

    const optionList = activeOptions.map(option => 
        <li class={styles.rbList}>
            <input onClick={() => changeOption(option)} type="radio" id={option} name="type" value={option} checked={option === type} class={activeOptions.length === 1 ? styles.square: null} />
            <label htmlFor={option}>
                <span>{option}</span>
                <span class="super">{lesson[option].length}</span>
            </label>
        </li>
    );

    return (
        <ul class={styles.typeOptions}>{optionList}</ul>
    )
};

export default QueryString;