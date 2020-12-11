export class History {

    lessonTitle: string;
    total: number;
    correct: number;

    constructor(lessonTitle, total, correct) {
        this.lessonTitle = lessonTitle;
        this.total = total;
        this.correct = correct;
      }
};