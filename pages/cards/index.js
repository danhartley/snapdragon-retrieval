// import { cards } from './cards';
import cards from './cards-json.json';

const Cards = () => {
    return (
        <div>{ cards.members[0].definition }</div>
    )
};

export default Cards;