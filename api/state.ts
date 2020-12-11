import { useState, useEffect } from "preact/hooks";
import { enums } from 'components/enums';
import { History } from 'components/classes';

export const useLocalStorageState = (defaulState, key) => {
    
    const [value, setValue] = useState(() => {
      const localStorageValue = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return localStorageValue !== null
        ? JSON.parse(localStorageValue)
        : defaulState;
    });

    useEffect(() => {
        switch(key) {
            case enums.STORAGE_KEY.HISTORY:
                const history = JSON.parse(window.localStorage.getItem(key)) as Array<History>;
                const updatedHistory = parseHistory(value, history);
                window.localStorage.setItem(key, JSON.stringify(updatedHistory));
                break;
        }
        }, [key, value]);
    return [value, setValue];
};

const parseHistory = (value: any, histories: Array<History>) => {

    if(!value || !value.scores) return histories;

    const score = value;
    let total = 0, correct = 0;
    score.scores.map(s => {
        total++;
        if (new Boolean(s.state))
            correct++;
        if (s.hasOwnProperty('isOrdered')) {
            total++;
            if (new Boolean(s.isOrdered))
                correct++;
        }
    });

    const history = histories
        ? histories.find(h => h.lessonTitle === score.lessonTitle) as History
        : new History(score.lessonTitle,0,0);

    history.total = history.total + total;
    history.correct = history.correct + correct;

    return histories ? [ ...histories.filter(h => h.lessonTitle !== history.lessonTitle), history ] : [ history ];
};

export const getFromLocalStorage = key => {
    return JSON.parse(window.localStorage.getItem(key));
};
