import { enums } from 'components/enums';

const sanitise = str => {
    return str.trim().toLowerCase();
}

const markUnordered = (lesson, placeholder) => {
    const score = { markedAnswerList: [], isCorrect: false, isOrderedCorrect: false };
    const unusedCorrectAnswers = getUnusedAnswers(lesson.question.items.map(i => sanitise(i.name)), lesson.answerList.map(a => sanitise(a.name)));
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
            score = markUnordered(lesson, placeholder);
            break;
        case enums.QUESTION_TYPE.ORDERED:
            score = markUnordered(lesson, placeholder);
            score.markedAnswerList.forEach((score, index) => {
                score.isOrdered = sanitise(score.name) === sanitise(lesson.question.items[index].name) ? enums.TRILEAN.TRUE : enums.TRILEAN.FALSE;
                score.correct = score.isOrdered === "false" ? sanitise(lesson.question.items[index].name) : null;
            });
            score.isOrderedCorrect = lesson.answerList.length === score.markedAnswerList.filter(score => score.isOrdered === enums.TRILEAN.TRUE).length;
            score.isCorrect = score.isOrderedCorrect;            
            break;
        case enums.QUESTION_TYPE.MULTIPLE_CHOICE:
            score = {
                scores: [],
                isCorrect: sanitise(lesson.question.answer) === sanitise(lesson.question.response),
                isOrderedCorrect: false
            };
            break;
    }
    score = { 
          ...score
        , ...getScore(score)
        , text: lesson.question.text
        , answers: lesson.question.answer ? [ lesson.question.answer ] : lesson.question.items.map(item => { return { name: item.name, value: item.value } })
        , type: lesson.question.type
        , unit: lesson.question.unit
        , total: 1
    };
    if(lesson.question.workings) score.workings = lesson.question.workings;
    return score;
};

const markOrdered = (lesson, placeholder = '---') => {
    const score = mark(lesson, placeholder);
    score.isCorrect = score.isOrderedCorrect;
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
    const score = { 
          total: question.answers.length
        , correct: (rightAnswers - wrongAnswers)
        , items: question.items
        , isCorrect: (rightAnswers - wrongAnswers) === question.answers.length};
    return { 
          ...score
        , text: lesson.question.text
        , answers: lesson.question.answers 
        , type:  lesson.question.type
        , unit:  lesson.question.unit
    };
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

const getPlaceholders = (question, placeholder) => {
    const placeholders = question.items.map((q, index) => {
        const ph = { name: placeholder, state: enums.TRILEAN.UNKNOWN } as any;
        if(q.value) { ph.value = q.value };
        return ph;
    });
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

const getScore = (score: any) => {
    let total = 1, correct = 0;
    if (score.markedAnswerList !== undefined) {
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
    } else if (score.hasOwnProperty('isCorrect')) {
        if(score.isCorrect) {
            total++;
            correct++;
        }
    } else {
        total = score.total;
        correct = score.correct;
    }
    return { total, correct };
}

const calculateWidth = (items, sortOn) => {
    let longest = items.map(i => i[sortOn]).sort((a, b) => b.length - a.length)[0].length;
        longest = longest < 10 ? longest + 50 : longest;
    let dynamicPadding = longest > 25 ? 50 : 25;
    let style = `--dynamicLength:${longest}; --dynamicPadding:${dynamicPadding}` as any;
    return style;
};

const toCase = (str) => {
    return (str && str.length > 0) ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};

const groupQuestionsAsItems = lesson => {
    
    const ranked = lesson.ranked || [];
    const unranked = lesson.unranked || [];
    const multiplechoice = lesson.multiplechoice || [];
    const multipleselect = lesson.multipleselect || [];

    const questions = [ ...multiplechoice, ...unranked, ...multipleselect, ...ranked ];

    return questions; 
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
    sortBy,
    calculateWidth,
    toCase,
    groupQuestionsAsItems
};
