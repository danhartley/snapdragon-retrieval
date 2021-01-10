import { enums } from 'components/enums';
import { communityScoreSummary } from 'components/question/community-score/community-score-logic';

describe('community scores', () => {

    let data, actual;

    test('for all tests types when correct is a simple binary 0 or 1', () => {

        data = {
            question: {
                type: enums.QUESTION_TYPE.MULTIPLE_CHOICE
            },
            total: 1,
            correct: 1,
            userCorrect: 1
        };

        actual = communityScoreSummary(data);

        expect(actual).toBe('That is the correct answer.');

        data.userCorrect = 0;

        actual = communityScoreSummary(data);

        expect(actual).toBe('No, that\'s not the right answer!');

        data.total = 5;
        data.correct = 5;

        actual = communityScoreSummary(data);

        expect(actual).toBe('100% of people answered this correctly.');

    });

    // test('for multiple choice', () => {

    //     data = {
    //         question: {
    //             type: enums.QUESTION_TYPE.MULTIPLE_CHOICE
    //         },
    //         total: 1,
    //         correct: 1,
    //         userCorrect: 1
    //     };

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('That is the correct answer.');

    //     data.userCorrect = 0;

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('No, that\'s not the right answer!');

    //     data.total = 5;
    //     data.correct = 5;

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('100% of people answered this correctly.');

    // });

    // test('for ordered', () => {

    //     data = {
    //         question: {
    //             type: enums.QUESTION_TYPE.ORDERED,
    //             items: [
    //                 { value: 1 },
    //                 { value: 2 }
    //             ]
    //         },
    //         total: 4,
    //         correct: 4,
    //         userCorrect: 4
    //     };

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('You scored 4 out of 4.');

    //     data.total = 20;
    //     data.correct = 16;

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('The average score for this test is 80%.');
    // });

    // test('for unordered', () => {

    //     data = {
    //         question: {
    //             type: enums.QUESTION_TYPE.UNORDERED,
    //             items: [
    //                 { value: 1 },
    //                 { value: 2 }
    //             ]
    //         },
    //         total: 2,
    //         correct: 2,
    //         userCorrect: 2
    //     };

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('You scored 2 out of 2.');

    //     data.total = 10;
    //     data.correct = 8;

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('The average score for this test is 1.6 out of 2.');

    //     data.total = 17;
    //     data.correct = 15;

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('The average score for this test is 1.76 out of 2.');
        
    //     data = {
    //         question: {
    //             type: enums.QUESTION_TYPE.UNORDERED,
    //             items: [
    //                 { value: 1 }
    //             ]
    //         },
    //         total: 20,
    //         correct: 5,
    //         userCorrect: 1
    //     };
        
    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('25% of people answered this correctly.');

    // });

    // test('for multiple select', () => {

    //     data = {
    //         question: {
    //             type: enums.QUESTION_TYPE.MULTIPLE_SELECT,
    //             answers: [
    //                 { value: 1 },
    //                 { value: 2 }
    //             ]
    //         },
    //         total: 2,
    //         correct: 2,
    //         userCorrect: 2
    //     };

    //     actual = communityScoreSummary(data);

    //     expect(actual).toBe('You scored 2 out of 2.');
    // });

});