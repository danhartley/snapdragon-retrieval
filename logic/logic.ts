import { enums } from 'components/enums';

const toArray = str => {
    return str.split(' ');
};

const sanitise = str => {
    return str.trim().toLowerCase();
}

const mark = (lesson) => {
    const scores = lesson.list.map(answer => {
        const score = lesson.question.items.find(item => toArray(item.name).find(name => sanitise(name) === sanitise(answer.name))); // fuzzy, not precise (flag?)            
        return score ? { name: answer.name, state: enums.TRILEAN.TRUE } : { name: answer.name, state: enums.TRILEAN.FALSE };
    });
    scores.isCorrect = lesson.list.length === scores.filter(score => score.state === enums.TRILEAN.TRUE).length;
    switch(lesson.question.type) {
        case enums.TEST_TYPE.UNORDERED:
            return scores;
        case enums.TEST_TYPE.ORDERED:
            scores.forEach((score, index) => {
                score.isOrdered = score.name === lesson.question.items[index].name ? enums.TRILEAN.TRUE : enums.TRILEAN.FALSE;
            });
            scores.isOrderedCorrect = lesson.list.length === scores.filter(score => score.isOrdered === enums.TRILEAN.TRUE).length;
            return scores;
    }
};

const markOrdered = lesson => {
    const scores = mark(lesson);
    scores.forEach((score, index) => {
        score.isOrdered = score.name === lesson.question.items[index].name ? enums.TRILEAN.TRUE : enums.TRILEAN.FALSE;
    });
    return scores;
};

const next = (direction, currentIndex, length) => {
    let index;
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

const updateList = (question, list, entry, placeholder) => {
    let updatedList;
    switch(question.type) {
        case enums.TEST_TYPE.UNORDERED:
            updatedList = [ entry, ...list.slice(0, list.length - 1) ];
            break;
        case enums.TEST_TYPE.ORDERED:
            const nonPlaceHolders = list.filter(l => l.name !== placeholder);
            const existingEntries = list.slice(0, nonPlaceHolders.length);
            const placeholderEntries = list.slice(existingEntries.length+1);
            updatedList = [ ...existingEntries, entry, ...placeholderEntries ];
            break;
    }
    return updatedList;
};

export const logic = {
    mark,
    markOrdered,
    next,
    updateList,
    getPlaceholders
};