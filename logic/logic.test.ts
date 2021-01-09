import { enums } from 'components/enums';
import { logic } from 'logic/logic';

describe('marking unordered lessons', () => {

    let lesson = {
        question: {
            "listCount": 2,
            "type": enums.QUESTION_TYPE.UNORDERED,
            items: [
                {"name": "beef"},
                {"name": "lamb"},
                {"name": "cheese"},
                {"name": "dairy beef"},
                {"name": "chocolate"}
            ]
        }
    };

    let answerList = [ {name:'beef', state: enums.TRILEAN.UNKNOWN }, { name:'cheese', state: enums.TRILEAN.UNKNOWN }];
    let score;

    test('expect all answers to be correct', () => {
         score = logic.mark({ ...lesson, answerList });         
         expect(score.markedAnswerList).toStrictEqual([
             { name: 'beef', state: enums.TRILEAN.TRUE },
             { name: 'cheese', state: enums.TRILEAN.TRUE },
         ]);
    });

    test('expect one answer to be incorrect', () => {
        answerList = [ {name:'beef', state: enums.TRILEAN.UNKNOWN }, { name:'rice', state: enums.TRILEAN.UNKNOWN }];
        score = logic.mark({ ...lesson, answerList });         
        expect(score.markedAnswerList).toStrictEqual([
            { name: 'beef', state: enums.TRILEAN.TRUE },
            { name: 'rice', state: enums.TRILEAN.FALSE, correct: 'lamb' },
        ]);
    });

    test('expect partial answer to be correct, in a fuzzy way', () => {
        answerList = [ {name:'beef', state: enums.TRILEAN.UNKNOWN }, {name:'lamb', state: enums.TRILEAN.UNKNOWN }, { name:'rice', state: enums.TRILEAN.UNKNOWN }];
        score = logic.mark({ ...lesson, answerList });         
        expect(score.markedAnswerList).toStrictEqual([
            { name: 'beef', state: enums.TRILEAN.TRUE },
            { name: 'lamb', state: enums.TRILEAN.TRUE },
            { name: 'rice', state: enums.TRILEAN.FALSE, correct: 'cheese' },
        ]);
    });
});

describe('marking unordered lessons', () => {
    
    let lesson = {
        question: {
            "listCount": 2,
            "type": enums.QUESTION_TYPE.UNORDERED,
            items: [
                {"name": "water"},
                {"name": "road"},
                {"name": "rail"},
                {"name": "air"}
            ]
        }
    };

    let answerList = [ {name:'water', state: enums.TRILEAN.UNKNOWN }, { name:'road', state: enums.TRILEAN.UNKNOWN}, { name:'rail', state: enums.TRILEAN.UNKNOWN }, { name:'air', state: enums.TRILEAN.UNKNOWN }];
    let score;

    test('check answers are in the correct order', () => {
        score = logic.markOrdered({ ...lesson, answerList });         
        expect(score.markedAnswerList).toStrictEqual([
            { correct: null, name: 'water', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'road', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'rail', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'air', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
        ]);
    });

    test('check answers are correct but in the wrong order', () => {
        answerList = [ {name:'water', state: enums.TRILEAN.UNKNOWN }, { name:'road', state: enums.TRILEAN.UNKNOWN}, { name:'air', state: enums.TRILEAN.UNKNOWN }, { name:'rail', state: enums.TRILEAN.UNKNOWN }];
        score = logic.markOrdered({ ...lesson, answerList });         
        expect(score.markedAnswerList).toStrictEqual([
            { correct: null, name: 'water', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'road', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'air', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.FALSE },
            { correct: null, name: 'rail', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.FALSE }
        ]);
    });

    test('check answers are correct based on test type', () => {
        lesson.question.type = enums.QUESTION_TYPE.ORDERED;
        answerList = [ {name:'water', state: enums.TRILEAN.UNKNOWN }, { name:'road', state: enums.TRILEAN.UNKNOWN}, { name:'rail', state: enums.TRILEAN.UNKNOWN }, { name:'air', state: enums.TRILEAN.UNKNOWN }];
        score = logic.mark({ ...lesson, answerList});
        expect(score.markedAnswerList).toStrictEqual([
            { correct: null, name: 'water', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'road', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'rail', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { correct: null, name: 'air', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
        ]);
    });

});

describe('iterate forward (next) and back(previous) through cards or questions', () => {
    let index;
    let direction = enums.DIRECTION.Next;
    let currentIndex = 0;
    let length = 5;
    test('move forward and back', () => {
        index = logic.next(direction, currentIndex, length);
        expect(index).toEqual(1);
        index = logic.next(direction, index, length);
        expect(index).toEqual(2);
        index = logic.next(direction, index, length);
        expect(index).toEqual(3);
        index = logic.next(enums.DIRECTION.Previous, index, length);
        expect(index).toEqual(2);
        index = logic.next(enums.DIRECTION.Previous, 0, length);
        expect(index).toEqual(4);
    });
});

describe('update answer answerList', () => {
    let question = {
        "listCount": 5,
        "type": enums.QUESTION_TYPE.UNORDERED,
        items: [
            {"name": "beef"},
            {"name": "lamb"},
            {"name": "cheese"},
            {"name": "dairy beef"},
            {"name": "chocolate"}
        ]
    };
    let entry = { name:'beef', state: enums.TRILEAN.UNKNOWN };
    let placeholder = '---';
    let answerList = logic.getPlaceholders(question.listCount, placeholder);
    let updatedList;

    test('unordered answer answerList', () => {
        updatedList = logic.updateAnswerList(question, answerList, entry, placeholder);
        expect(updatedList).toEqual([ 
            { name:'beef', state: enums.TRILEAN.UNKNOWN },         
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN }
        ])
    });

    test('ordered answer answerList', () => {
        question.type = enums.QUESTION_TYPE.ORDERED;
        answerList = logic.getPlaceholders(question.listCount, placeholder);        
        entry = { name:'beef', state: enums.TRILEAN.UNKNOWN };
        updatedList = logic.updateAnswerList(question, answerList, entry, placeholder);
        entry = { name:'lamb', state: enums.TRILEAN.UNKNOWN };
        updatedList = logic.updateAnswerList(question, updatedList, entry, placeholder);
        expect(updatedList).toEqual([ 
            { name:'beef', state: enums.TRILEAN.UNKNOWN },         
            { name:'lamb', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN }
        ])
    });
});

describe('should return getUnusedAnswers list', () => {
    const fullList = ["beef", "lamb", "cheese", "coffee", "chocolate"];
    const answerList = ["cheese"];
    const listOfDifferences = ["beef", "lamb", "coffee", "chocolate"];
    test('should return expected list', () => {
        expect(logic.getUnusedAnswers(fullList, answerList)).toStrictEqual(listOfDifferences);
    });
});

describe('marking markMultipleAnswers questions', () => {
    let score, question = {
        "answers": [
            "requires two doses",
            "should be stored at 70°",
            "can be stored for 5 days at 2-8°"
        ],
        "alternatives": [
            "unsuitable for people with weak immune systems",
            "there are many other similar licenced vaccines"
        ],
        items: [
            {
              "name": "should be stored at 70°"
            },
            {
              "name": "there are many other similar licenced vaccines"
            },
            {
              "name": "can be stored for 5 days at 2-8°"
            },
            {
              "name": "requires two doses"
            },
            {
              "name": "unsuitable for people with weak immune systems"
            }
          ]
    }, checkedAnswers = [
        "requires two doses",
        "should be stored at 70°",
        "unsuitable for people with weak immune systems",
    ],
    lesson = {question, checkedAnswers};

    test('check for balance of right and wrong answers', () => {
        score = logic.markMultipleAnswers(lesson);
        expect(score.total).toBe(3);
        expect(score.correct).toBe(0);
    });
    
});