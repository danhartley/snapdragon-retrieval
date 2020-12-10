import styles from 'components/score/score.module.scss';

export const Score = ({scores}) => {

    const listScores = scores.map(score => <li class={score.isCorrect ? styles.correct : styles.incorrect}>{score.answer}</li>);

    return (
        listScores ? <ul>{listScores}</ul> : null
    )
};