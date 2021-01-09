import { enums } from 'components/enums';
import { communityScoreSummary } from 'components/question/community-score/community-score-logic';

describe('community scores', () => {

    let data, actual;

    test.only('for multiple choice', () => {

        data = {
            question: {
                type: enums.QUESTION_TYPE.MULTIPLE_CHOICE
            },
            total: 1,
            correct: 1,
            userCorrect: 1
        };

        actual = communityScoreSummary(data);

        expect(actual).toBe('You are the first person to answer correctly!');

        data.userCorrect = 0;

        actual = communityScoreSummary(data);

        expect(actual).toBe('No one has answered this correctly yet.');

        data.total = 5;
        data.correct = 5;

        actual = communityScoreSummary(data);

        expect(actual).toBe('100% of people answered this correctly.');

    });

    test.only('for ordered', () => {

        data = {
            question: {
                type: enums.QUESTION_TYPE.ORDERED,
                answers: [
                    { value: 1 },
                    { value: 2 }
                ]
            },
            total: 4,
            correct: 4,
            userCorrect: 4
        };

        actual = communityScoreSummary(data);

        expect(actual).toBe('You scored 4 out of 4');

        data.total = 20;
        data.correct = 16;

        actual = communityScoreSummary(data);

        expect(actual).toBe('The average score for this test is 80%');
    });

    test.only('for unorded', () => {

        data = {
            question: {
                type: enums.QUESTION_TYPE.UNORDERED,
                answers: [
                    { value: 1 },
                    { value: 2 }
                ]
            },
            total: 2,
            correct: 2,
            userCorrect: 2
        };

        actual = communityScoreSummary(data);

        expect(actual).toBe('You scored 2 out of 2');

        data.total = 10;
        data.correct = 8;

        actual = communityScoreSummary(data);

        expect(actual).toBe('The average score for this test is 1.6 out of 2');

    });

    test.only('for multiple select', () => {

        data = {
            question: {
                type: enums.QUESTION_TYPE.MULTIPLE_SELECT,
                answers: [
                    { value: 1 },
                    { value: 2 }
                ]
            },
            total: 2,
            correct: 2,
            userCorrect: 2
        };

        actual = communityScoreSummary(data);

        expect(actual).toBe('You scored 2 out of 2');
    });

});