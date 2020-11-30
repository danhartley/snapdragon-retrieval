import cards from './cards.json';

const Cards = () => {
    return (
        <div>{ cards.members[0].definition }</div>
    )
};

export default Cards;