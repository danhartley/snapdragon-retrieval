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

const parseHistory = (score: any, histories: Array<History>) => {

    if(!score) return histories;

    let total = 0, correct = 0;

    if(score.markedAnswerList !== undefined) {
        score.markedAnswerList.map(s => {
            total++;
            if (s.state === enums.TRILEAN.TRUE)
                correct++;
            if (s.hasOwnProperty('isOrdered')) {
                total++;
                if (s.isOrdered === enums.TRILEAN.TRUE)
                    correct++;
            }
        });
    } else if(score.isCorrect) {
        total++;
        correct++;
    }

    const history = histories !== null
        ? histories.find(h => h.lessonTitle === score.lessonTitle)
            ? histories.find(h => h.lessonTitle === score.lessonTitle) as History
            : new History(score.lessonTitle,0,0)
        : new History(score.lessonTitle,0,0);

    history.total = history.total + total;
    history.correct = history.correct + correct;

    return histories ? [ ...histories.filter(h => h.lessonTitle !== history.lessonTitle), history ] : [ history ];
};

export const getFromLocalStorage = key => {
    return JSON.parse(window.localStorage.getItem(key));
};
