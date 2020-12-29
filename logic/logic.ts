import { enums } from 'components/enums';

const sanitise = str => {
    return str.trim().toLowerCase();
}

const markUnordered = (lesson, placeholder) => {
    const score = { markedAnswerList: [], isCorrect: false, isOrderedCorrect: false };
    const unusedCorrectAnswers = getUnusedAnswers(lesson.question.items.map(i => i.name), lesson.answerList.map(a => a.name));
    score.markedAnswerList = lesson.answerList.filter(answer => answer.name !== placeholder).map(answer => {
        const score = lesson.question.items.find(item => sanitise(item.name) === sanitise(answer.name));
        return score 
            ? { name: answer.name, state: enums.TRILEAN.TRUE } 
            : { name: answer.name, state: enums.TRILEAN.FALSE, correct: unusedCorrectAnswers.splice(0,1)[0] };
    });
    score.isCorrect = lesson.answerList.length === score.markedAnswerList.filter(score => score.state === enums.TRILEAN.TRUE).length;
    return score;
};

const mark = (lesson, placeholder = '---') => {
    let score;
    switch(lesson.question.type) {
        case enums.QUESTION_TYPE.UNORDERED:
            return markUnordered(lesson, placeholder);
        case enums.QUESTION_TYPE.ORDERED:
            score = markUnordered(lesson, placeholder);
            score.markedAnswerList.forEach((score, index) => {
                score.isOrdered = sanitise(score.name) === sanitise(lesson.question.items[index].name) ? enums.TRILEAN.TRUE : enums.TRILEAN.FALSE;
                score.correct = score.isOrdered === "false" ? sanitise(lesson.question.items[index].name) : null;
            });
            score.isOrderedCorrect = lesson.answerList.length === score.markedAnswerList.filter(score => score.isOrdered === enums.TRILEAN.TRUE).length;
            return score;
        case enums.QUESTION_TYPE.MULTIPLE_CHOICE:
            score = {
                scores: [],
                isCorrect: sanitise(lesson.question.answer) === sanitise(lesson.question.response),
                isOrderedCorrect: false
            };
            return score;
    }
};

const markOrdered = (lesson, placeholder = '---') => {
    const score = mark(lesson, placeholder);
    score.markedAnswerList.forEach((score, index) => {
        score.isOrdered = sanitise(score.name) === sanitise(lesson.question.items[index].name) ? enums.TRILEAN.TRUE : enums.TRILEAN.FALSE;
        score.correct = !score.isOrdered ? sanitise(lesson.question.items[index].name) : null;
    });
    return score;
};

const markMultipleAnswers = (lesson) => {
    
    const {question, checkedAnswers} = lesson;

    question.items.forEach(answer => {
        if(checkedAnswers.indexOf(answer.name) > -1) {
            answer.state = question.answers.indexOf(answer.name) > -1
                ? enums.TRILEAN.TRUE
                : enums.TRILEAN.FALSE
        } else {
            answer.state = question.answers.indexOf(answer.name) > -1
                ? enums.TRILEAN.FALSE
                : enums.TRILEAN.UNKNOWN
        }
    });

    const rightAnswers = question.items.filter(answer => answer.state === enums.TRILEAN.TRUE).length;
    const wrongAnswers = question.items.filter(answer => answer.state === enums.TRILEAN.FALSE).length;
    const score = { total: question.answers.length, correct: (rightAnswers - wrongAnswers), items: question.items };
    return score;
};

const next = (direction, currentIndex, length) => {
    let index: number;
    switch(direction) {
        case enums.DIRECTION.Next:
            index = (currentIndex + 1) % length;
            break;
        case enums.DIRECTION.Previous:
            index = currentIndex > 0
                ? currentIndex - 1
                : index = length-1;
            break;
        default:
            index = 0;
    }

    return index;
};

const getPlaceholders = (number, placeholder) => {
    const placeholders = [];
    for(let step = 0; step < number; step++) { 
        placeholders.push({ name: placeholder, state: enums.TRILEAN.UNKNOWN });
    };
    return placeholders;
};

const updateAnswerList = (question, list, entry, placeholder) => {
    let updatedList;
    switch(question.type) {
        case enums.QUESTION_TYPE.UNORDERED:
            updatedList = [ entry, ...list.slice(0, list.length - 1) ];
            break;
        case enums.QUESTION_TYPE.ORDERED:
            const nonPlaceHolders = list.filter(l => l.name !== placeholder);
            const existingEntries = list.slice(0, nonPlaceHolders.length);
            const placeholderEntries = list.slice(existingEntries.length+1);
            updatedList = [ ...existingEntries, entry, ...placeholderEntries ];
            break;
    }
    return updatedList;
};

const shuffleArray = array => {

    if(!array || array.length === 0) return;

    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return [ ...array ];
};

const getUnusedAnswers = (fullList: any, answerList: any) => {
    return fullList.filter(x => answerList.indexOf(x) === -1);
};

const sortBy = (arr, prop, dir = 'asc') => {
    return dir === 'asc' 
      ? arr.sort((a, b) => parseFloat(a[prop]) - parseFloat(b[prop]))
      : arr.sort((a, b) => parseFloat(b[prop]) - parseFloat(a[prop]));  
};

export const logic = {
    mark,
    markUnordered,
    markOrdered,
    markMultipleAnswers,
    next,
    updateAnswerList,
    getPlaceholders,
    shuffleArray,
    getUnusedAnswers,
    sortBy
};
