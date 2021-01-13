import { api } from 'api/api';

const getQuestions = async lesson => {

    let questions;
    
    const response = await api.getQuestionsByLesson(lesson) as Array<any>;
    
    questions = response.map(r => r.length > 0 ? r : null).filter(r => r);

    if(questions.length === 0) {                
        questions = await api.createQuestions(lesson);
    }            

    return questions;
};

const getLessonQuestionHistories = async lesson => {

    let lessonQuestionHistories, lessonHistory, lessonHasQuestions;
    
    lessonHistory = await api.getLessonByTitle(lesson.title) as any;
    
    lessonHasQuestions = (lessonHistory && lessonHistory.data && lessonHistory.data.length > 0);

    lessonHistory = lessonHasQuestions ? lessonHistory : await api.createLesson(lesson.title);
    
    lessonQuestionHistories = await getQuestions(lesson);

    lessonQuestionHistories = lessonQuestionHistories.map(lqh => {
        return Array.isArray(lqh) ? lqh[0].data : lqh;
    });

    return lessonQuestionHistories;
};

export const addLessonCommuityState = async lesson => {

    if(!lesson.questions) return;

    if(lesson.total) return;

    const lessonQuestionHistories = await getLessonQuestionHistories(lesson) as Array<any>;
                
    lesson.questions.forEach(question => {
        const questionHistory = lessonQuestionHistories.find(qt => qt.text === question.text) as any;
        if(questionHistory) {
            question.total = questionHistory.total;
            question.correct = questionHistory.correct;
        }
    });
};

export const getLessonSummaries = async lesson => {

    const lessonQuestionHistories = await getLessonQuestionHistories(lesson) as Array<any>;
    
    return lessonQuestionHistories.map(lqh => {
        return {
            total: lqh.total,
            correct: lqh.correct,
            text: lqh.text
        }
    });

};