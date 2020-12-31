export class History {

    title: string;
    total: number;
    correct: number;
    scores: Array<any>;

    constructor(title, total, correct, scores) {
        this.title = title;
        this.total = total;
        this.correct = correct;
        this.scores = scores;
      }
};