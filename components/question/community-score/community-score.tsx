import { communityScoreSummary } from 'components/question/community-score/community-score-logic';

import styles from 'components/question/community-score/community-score.module.scss';

const CommunityScore = ({data}) => {

    if(data.question === undefined || data.question.type === undefined) {
        return (<section class={styles.container}><span></span></section>);
    }

    const summary = communityScoreSummary(data);
    
    return (
        <section class={styles.container}><span>{summary}</span></section>
    );

};

export default CommunityScore;