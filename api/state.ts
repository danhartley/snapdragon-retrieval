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
                if(updatedHistory) {
                    window.localStorage.setItem(key, JSON.stringify(updatedHistory));
                }
                break;
        }
    }, [key, value]);

    return [value, setValue];
};

const parseHistory = (score: any, histories: Array<History>) => {

    if(!score || score.total === undefined) return histories;

    let { total, correct, title } = score;

    const history = histories !== null
        ? histories.find(h => h.title === title)
            ? histories.find(h => h.title === title).scores.find(s => s.text === score.text)
                ? new History(title, 0, 0, [score])
                : { ...histories.find(h => h.title === title), scores: [ ...histories.find(h => h.title === title).scores, score ] } as History
            : new History(title, 0, 0, [score])
        : new History(title, 0, 0, [score]);

    history.total = history.total + total;
    history.correct = history.correct + correct;

    return histories ? [ ...histories.filter(h => h.title !== history.title), history ] : [ history ];
};

export const getFromLocalStorage = key => {
    return JSON.parse(window.localStorage.getItem(key));
};

