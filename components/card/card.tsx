import { useState, useEffect, useRef } from 'preact/hooks';
import { ExternalLinkList } from 'components/list/list';
import { enums } from 'components/enums';
import { logic } from 'logic/logic';

import styles from 'components/card/card.module.scss';

export const Card = ({lesson}) => {

    if(!lesson.cards) return;

    const [card, setCard] = useState(lesson.cards[0]);
    const [face, setFace] = useState({ value: card.term, isTerm: true, index: card.term ? lesson.cards.map(c => c.term).indexOf(card.term) : 0 });

    const flipCard = () => {
        setFace({ value: face.isTerm ? card.definition : card.term, isTerm: !face.isTerm, index: face.index });
    };

    const nextCard = e => {
        e.preventDefault();
        const index = logic.next(parseInt(e.target.dataset.direction), face.index, lesson.cards.length);
        const _card = lesson.cards[index];
        setCard(_card);
        setFace({ value: _card.term, isTerm: true, index });
    }; 

    return (
        <div class={styles.cards}>
            <section>
                <div class={styles.term}>{face.value}</div>
            </section>
            <section class={styles.controls}>
                <button data-direction={enums.DIRECTION.Previous} onClick={nextCard} class={styles.previous}></button>
                <button data-direction={enums.DIRECTION.Next} onClick={nextCard} class={styles.next}></button>
                <button onClick={flipCard} class={styles.flip}></button>
                <button class={styles.shuffle}></button>
            </section>
            <section class={styles.source}>
                <div><a href={card.source} target="_blank">Open source in a new tab</a></div>
                <div>Source: {card.author}</div>
            </section>
            <section><ExternalLinkList items={lesson.cards} source={lesson.source}></ExternalLinkList></section>
        </div>
    )
};