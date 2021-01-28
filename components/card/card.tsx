import { useState, useEffect, useRef } from 'preact/hooks';
import { ExternalLinkList } from 'components/list/list';
import { enums } from 'components/enums';
import { logic } from 'logic/logic';
import Sources from 'components/question/source';

import styles from 'components/card/card.module.scss';
import { Question } from 'components/question/question';

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

    const sources = card.sources ? card.sources.map(card => {
        <>
        <div><a href={card.source} rel="noreferrer" target="_blank">Additional source (opens in a new tab)</a></div>
        <div>Author: {card.author}</div>
        </>
    }): null;

    const isDefinitionLong = card.definition.length > 200;

    return (
        <>
        <div class={styles.cards}>
            <section>
                <div onClick={flipCard} class={`${styles.term} ${face.value === card.definition ? styles.definition : null}`}>
                    <span class={isDefinitionLong ? styles.longDefinition : null}>{face.value}</span>
                </div>
            </section>
            <section class={styles.controls}>
                <button aria-label="Got to previous card" data-direction={enums.DIRECTION.Previous} onClick={nextCard} class={styles.previous} disabled={lesson.cards.length === 1}></button>
                <button aria-label="Got to next card" data-direction={enums.DIRECTION.Next} onClick={nextCard} class={styles.next} disabled={lesson.cards.length === 1}></button>
                <button aria-label="Turn the card over" onClick={flipCard} class={styles.flip}></button>
                <button aria-label="Shuffle the cards" class={styles.shuffle} disabled={lesson.cards.length === 1}></button>
            </section>
            {/* <section><ExternalLinkList items={lesson.cards} source={lesson.source}></ExternalLinkList></section> */}
        </div>
        <Sources sources={card.sources} />
        </>
    )
};