import { enums } from 'components/enums';

import styles from 'components/question/community-score.module.scss';

const CommunityScore = ({data}) => {

    let summary, questionMaxTotal, average: number = 0;

    average = data.total === 0 ? 0 : Math.floor(data.correct / data.total);

    if(data.question === undefined || data.question.type === undefined) {
        return (<section class={styles.container}><span></span></section>);
    }

    switch(data.question.type) {
        case enums.QUESTION_TYPE.MULTIPLE_CHOICE:
            summary = data.total === 1
                ? data.userCorrect === 1
                    ? 'You are the first person to answer correctly!'
                    : 'No one has answered this correctly yet.' 
                : `${average * 100}% of people answered this correctly.`;
            break;
        case enums.QUESTION_TYPE.ORDERED:
            summary = (data.question.answers && data.total === data.question.answers.length * 2)
                ? `You scored ${average * 2} out of ${data.question.answers.length}`
                : `The average score for this test is ${average} out of ${data.question.answers.length * 2}`;
            break;
        case enums.QUESTION_TYPE.UNORDERED:
        case enums.QUESTION_TYPE.MULTIPLE_SELECT:
            questionMaxTotal = data.question.answers ? data.question.answers.length : data.question.items ? data.question.items.length : 0;
            summary = (data.total === questionMaxTotal)
                        ? `You scored ${(average * questionMaxTotal)} out of ${data.question.answers.length}`
                        : data.question.answers
                            ? `The average score for this test is ${(average * questionMaxTotal)} out of ${data.question.answers.length}`
                            : `${average * 100}% of people answered this correctly.`;
            break;
    }
    
    return (
        <section class={styles.container}><span>{summary}</span></section>
    );

};

export default CommunityScore;