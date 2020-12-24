import styles from 'components/question/source.module.scss';

const Source = ({source}) => {
    return (
        <div><a href={source.source} target="_blank">Source: {source.author}</a></div>
    )
};

const Sources = ({sources}) => {

    if(!sources) return null;

    return (
        <section class={styles.sources}>
            { sources.length === 1 ? <div>Source (opens in a new tab):</div> : <div>Additional sources (open in new tabs):</div> }
            { sources.map(source => <Source source={source} /> )}
        </section>
    )
};

export default Sources;