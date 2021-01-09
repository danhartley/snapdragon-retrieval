import { enums } from 'components/enums';

export const communityScoreSummary = data => {

    let summary, questionMaxTotal, average: number = 0, orderedQuestionMaxTotal;

    average = data.total === 0 ? 0 : Math.floor((data.correct / data.total)*100);
    questionMaxTotal = data.question.answers ? data.question.answers.length : data.question.items ? data.question.items.length : 0;
    orderedQuestionMaxTotal = data.question.answers ? data.question.answers.length * 2 : 0;

    switch(data.question.type) {
        case enums.QUESTION_TYPE.MULTIPLE_CHOICE:
            summary = data.total === 1
                ? data.userCorrect === 1
                    ? 'You are the first person to answer correctly!'
                    : 'No one has answered this correctly yet.' 
                : `${average}% of people answered this correctly.`;
            break;
        case enums.QUESTION_TYPE.ORDERED:
            summary = (data.question.answers && data.total === orderedQuestionMaxTotal)
                ? `You scored ${orderedQuestionMaxTotal} out of ${orderedQuestionMaxTotal}`
                : `The average score for this test is ${average}%`;
            break;
        case enums.QUESTION_TYPE.UNORDERED:
        case enums.QUESTION_TYPE.MULTIPLE_SELECT:            
            summary = (data.total === questionMaxTotal)
                        ? `You scored ${(average/100 * questionMaxTotal)} out of ${data.question.answers.length}`
                        : data.question.answers
                            ? `The average score for this test is ${(average/100 * questionMaxTotal)} out of ${data.question.answers.length}`
                            : `${average}% of people answered this correctly.`;
            break;
    }

    return summary;
};
