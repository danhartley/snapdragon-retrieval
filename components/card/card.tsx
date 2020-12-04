import { useState, useEffect, useRef } from 'preact/hooks';

import styles from 'components/card.module.scss';

enum Direction {
    Previous = 1,
    Next
  }

export const Card = ({lesson}) => {

    const [card, setCard] = useState(() => lesson.cards[0]);
    const [face, setFace] = useState(() => { return { value: card.term, isTerm: true, index: 0 } });

    const flipCard = () => {
        setFace({ value: face.isTerm ? card.definition : card.term, isTerm: !face.isTerm, index: face.index });
    };

    const nextCard = e => {
        e.preventDefault();
        let index;
        switch(parseInt(e.target.dataset.direction)) {
            case Direction.Next:
                index = (face.index + 1) % lesson.cards.length;
                break;
            case Direction.Previous:
                index = index > 0
                    ? index - 1
                    : index = lesson.cards.length-1;
                break;
            default:
                index = 0;
        }
        setCard(lesson.cards[index]);
        setFace({ value: card.term, isTerm: true, index });
    }; 

    return (
        <div class={styles.cards}>
            <section>
                <div class={styles.term}>{face.value}</div>
            </section>
            <section class={styles.controls}>
                <button data-direction={Direction.Previous} onClick={nextCard} class={styles.previous}></button>
                <button data-direction={Direction.Next} onClick={nextCard} class={styles.next}></button>
                <button onClick={flipCard} class={styles.flip}></button>
                <button class={styles.shuffle}></button>            
                <div></div>
                <div class={styles.centred}>Card count: {lesson.cards.length}</div>            
            </section>
            <section class={styles.source}>
                <div><a href={card.source} target="_blank">Open source in a new tab</a></div>
                <div>Source: {card.author}</div>
            </section>
        </div>
    )
};