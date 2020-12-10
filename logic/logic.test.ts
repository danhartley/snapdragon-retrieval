import { enums } from 'components/enums';
import { logic } from 'logic/logic';

describe('marking unordered lessons', () => {

    let lesson = {
        question: {
            "listCount": 2,
            "type": enums.TEST_TYPE.UNORDERED,
            items: [
                {"name": "beef (beef herd)"},
                {"name": "lamb & mutton"},
                {"name": "cheese"},
                {"name": "beef (dairy herd)"},
                {"name": "dark chocolate"}
            ]
        }
    };

    let list = [ {name:'beef', state: enums.TRILEAN.UNKNOWN }, { name:'cheese', state: enums.TRILEAN.UNKNOWN }];
    let scores;

    test('expect all answers to be correct', () => {
         scores = logic.mark({ ...lesson, list });         
         expect(scores).toStrictEqual([
             { name: 'beef', state: enums.TRILEAN.TRUE },
             { name: 'cheese', state: enums.TRILEAN.TRUE },
         ]);
    });

    test('expect one answer to be incorrect', () => {
        list = [ {name:'beef', state: enums.TRILEAN.UNKNOWN }, { name:'rice', state: enums.TRILEAN.UNKNOWN }];
        scores = logic.mark({ ...lesson, list });         
        expect(scores).toStrictEqual([
            { name: 'beef', state: enums.TRILEAN.TRUE },
            { name: 'rice', state: enums.TRILEAN.FALSE },
        ]);
    });

    test('expect partial answer to be correct, in a fuzzy way', () => {
        list = [ {name:'beef', state: enums.TRILEAN.UNKNOWN }, {name:'lamb', state: enums.TRILEAN.UNKNOWN }, { name:'rice', state: enums.TRILEAN.UNKNOWN }];
        scores = logic.mark({ ...lesson, list });         
        expect(scores).toStrictEqual([
            { name: 'beef', state: enums.TRILEAN.TRUE },
            { name: 'lamb', state: enums.TRILEAN.TRUE },
            { name: 'rice', state: enums.TRILEAN.FALSE },
        ]);
    });
});

describe('marking unordered lessons', () => {
    
    let lesson = {
        question: {
            "listCount": 2,
            "type": enums.TEST_TYPE.UNORDERED,
            items: [
                {"name": "water"},
                {"name": "road"},
                {"name": "rail"},
                {"name": "air"}
            ]
        }
    };

    let list = [ {name:'water', state: enums.TRILEAN.UNKNOWN }, { name:'road', state: enums.TRILEAN.UNKNOWN}, { name:'rail', state: enums.TRILEAN.UNKNOWN }, { name:'air', state: enums.TRILEAN.UNKNOWN }];
    let scores;

    test('check answers are in the correct order', () => {
        scores = logic.markOrdered({ ...lesson, list });         
        expect(scores).toStrictEqual([
            { name: 'water', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'road', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'rail', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'air', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
        ]);
    });

    test('check answers are correct but in the wrong order', () => {
        list = [ {name:'water', state: enums.TRILEAN.UNKNOWN }, { name:'road', state: enums.TRILEAN.UNKNOWN}, { name:'air', state: enums.TRILEAN.UNKNOWN }, { name:'rail', state: enums.TRILEAN.UNKNOWN }];
        scores = logic.markOrdered({ ...lesson, list });         
        expect(scores).toStrictEqual([
            { name: 'water', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'road', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'air', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.FALSE },
            { name: 'rail', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.FALSE }
        ]);
    });

    test('check answers are correct based on test type', () => {
        lesson.question.type = enums.TEST_TYPE.ORDERED;
        list = [ {name:'water', state: enums.TRILEAN.UNKNOWN }, { name:'road', state: enums.TRILEAN.UNKNOWN}, { name:'rail', state: enums.TRILEAN.UNKNOWN }, { name:'air', state: enums.TRILEAN.UNKNOWN }];
        scores = logic.mark({ ...lesson, list });         
        expect(scores).toStrictEqual([
            { name: 'water', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'road', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'rail', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
            { name: 'air', state: enums.TRILEAN.TRUE, isOrdered: enums.TRILEAN.TRUE },
        ]);
    });

});

describe('iterate forward (next) and back(previous) through cards or tests', () => {
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

describe('update answer list', () => {
    let question = {
        "listCount": 5,
        "type": enums.TEST_TYPE.UNORDERED,
        items: [
            {"name": "beef (beef herd)"},
            {"name": "lamb & mutton"},
            {"name": "cheese"},
            {"name": "beef (dairy herd)"},
            {"name": "dark chocolate"}
        ]
    };
    let entry = { name:'beef', state: enums.TRILEAN.UNKNOWN };
    let placeholder = '---';
    let list = logic.getPlaceholders(question.listCount, placeholder);
    let updatedList;

    test('unordered answer list', () => {
        updatedList = logic.updateList(question, list, entry, placeholder);
        expect(updatedList).toEqual([ 
            { name:'beef', state: enums.TRILEAN.UNKNOWN },         
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN }
        ])
    });

    test.only('ordered answer list', () => {
        question.type = enums.TEST_TYPE.ORDERED;
        list = logic.getPlaceholders(question.listCount, placeholder);        
        entry = { name:'beef', state: enums.TRILEAN.UNKNOWN };
        updatedList = logic.updateList(question, list, entry, placeholder);
        entry = { name:'lamb', state: enums.TRILEAN.UNKNOWN };
        updatedList = logic.updateList(question, updatedList, entry, placeholder);
        expect(updatedList).toEqual([ 
            { name:'beef', state: enums.TRILEAN.UNKNOWN },         
            { name:'lamb', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN },
            { name:'---', state: enums.TRILEAN.UNKNOWN }
        ])
    });
});