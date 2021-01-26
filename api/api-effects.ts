import { api } from 'api/api';

const getQuestions = async lesson => {

    let questions;
    
    const response = await api.getQuestionsByLesson(lesson) as Array<any>;
    
    questions = response.map(r => r.length > 0 ? r : null).filter(r => r);

    // if(questions.length === 0) {                
    //     questions = await api.createQuestions(lesson);
    // }            

    return questions;
};

const getLessonQuestionHistories = async lesson => {

    let questionScores, lessonScores;
    
    lessonScores = await api.getLessonByTitle(lesson.title) as any;

    // lessonScores = (lessonScores && lessonScores.data && lessonScores.data.length > 0) || await api.createLesson(lesson.title);
    
    questionScores = await getQuestions(lesson);

    questionScores = questionScores.map(lqh => {
        return Array.isArray(lqh) ? lqh[0].data : lqh;
    });

    return questionScores;
};

export const createLessonHistories = async lesson => {

    await api.createLesson(lesson.title);

    const questions = await api.createQuestions(lesson);

    return questions;
}

export const addLessonCommuityState = async lesson => {

    if(!lesson.questions) return;

    if(lesson.total) return;

    const questionScores = await getLessonQuestionHistories(lesson) as Array<any>;
                
    lesson.questions.forEach(question => {
        const questionHistory = questionScores.find(qt => qt.text === question.text) as any;
        if(questionHistory) {
            question.total = questionHistory.total;
            question.correct = questionHistory.correct;
        }
    });
};

export const getLessonSummaries = async lesson => {

    const questionScores = await getLessonQuestionHistories(lesson) as Array<any>;
    
    return questionScores.map(lqh => {
        return {
            total: lqh.total,
            correct: lqh.correct,
            text: lqh.text
        }
    });

};