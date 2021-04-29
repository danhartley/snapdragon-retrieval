import styles from 'components/list/list.module.scss';

export const ExternalLinkList = ({items, source}) => {

    const listItems = items.map(item => {
        return <li>
            <a target="_blank" href={`${source}`} rel="noreferrer" >{item.term}</a>
            {/* <a target="_blank" href={`${source}#:~:text=${item.text}`}>{item.term}</a> */}
        </li>
    });

    return (
        <ul>{listItems}</ul>
    )
};

export const RankedList = ({items, unit}) => {

    const rows = [];

    items.map(item => {
        const row = [];
        for (const [key, value] of Object.entries(item)) {
            key === 'value' ? row.push(<><td>{value}</td><td class={styles.unitText}>{unit}</td></>) : row.push(<td>{value}</td>);
        }   
        rows.push(<tr>{row}</tr>);
    });

    return (
        <table class={styles.data}>{rows}</table>
    )
};