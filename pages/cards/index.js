import cards from './cards.json';

const Cards = () => {
    return (
        <div>{ cards.cardList[0].definition }</div>
    )
};

export default Cards;