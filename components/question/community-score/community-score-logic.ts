import { enums } from 'components/enums';

export const communityScoreSummary = data => {

    let summary, average: number = 0, total;

    average = data.total === 0 ? 0 : Math.round((data.correct / data.total) * 100);

    summary = data.total === 1
        ? data.userCorrect === 1
            ? 'That is the correct answer.'
            : 'No, that\'s not the right answer!' 
        : `${average}% of people answered this correctly.`;


    // switch(data.question.type) {
    //     case enums.QUESTION_TYPE.MULTIPLE_CHOICE:
    //         summary = data.total === 1
    //             ? data.userCorrect === 1
    //                 ? 'That is the correct answer.'
    //                 : 'No, that\'s not the right answer!' 
    //             : `${average * 100}% of people answered this correctly.`;
    //         break;
    //     case enums.QUESTION_TYPE.ORDERED:
    //         total = (data.question.items.length * 2);            
    //         summary = data.total === total
    //             ? `You scored ${data.userCorrect} out of ${total}.`
    //             : `The average score for this test is ${average * 100}%.`;
    //         break;
    //     case enums.QUESTION_TYPE.UNORDERED:
    //         total = data.question.items.length;            
    //         summary = data.total === total
    //             ? `You scored ${(data.userCorrect)} out of ${total}.`
    //             : total === 1
    //                 ? `${average * 100}% of people answered this correctly.`
    //                 : `The average score for this test is ${average * total} out of ${total}.`;
    //         break;
    //     case enums.QUESTION_TYPE.MULTIPLE_SELECT:      
    //         total = data.question.answers.length;      
    //         summary = data.total === total
    //                     ? `You scored ${(data.userCorrect)} out of ${total}.`
    //                     : `${average * 100}% of people answered this correctly.`;
    //         break;
    // }

    return summary;
};
