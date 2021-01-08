import { POINT_CONVERSION_COMPRESSED } from 'constants';
import faunadb from 'faunadb';

const createLesson = async title => {

    const q = faunadb.query;
    const client = new faunadb.Client({ secret: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo' });

    const lesson = await client.query(
        q.Create(
            q.Collection("Lesson"),
            {
                data: {
                    "title": title
                }
        }));
    
    return lesson;
};

const getLessons = async () => {

    const q = faunadb.query;
    const client = new faunadb.Client({ secret: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo' });

    const lessons = await client.query(q.Map(
        q.Paginate(
            q.Match(q.Index("allLessons"))
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      ));

      return lessons;
};

const getLessonByTitle = async (title = '39 Ways to Save the Planet: #1 Super Rice') => {

    const q = faunadb.query;
    const client = new faunadb.Client({ secret: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo' });

    const lesson = await client.query(q.Map(
        q.Paginate(
            q.Match(q.Index("lessonByTitle"), title)
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      ));

      return lesson;
};

const getQuestionByText = async (text = 'Rice provides approximately what percentage of the world\'s calories?') => {

    const q = faunadb.query;
    const client = new faunadb.Client({ secret: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo' });

    // const question = await client.query(q.Map(
    //     q.Paginate(
    //         q.Match(q.Index("questionsByQuestionText"), text)
    //     ),
    //     q.Lambda("X", q.Get(q.Var("X")))
    //   )) as any;

    // return question;

    return client.query(q.Map(
        q.Paginate(
            q.Match(q.Index("questionsByQuestionText"), text)
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      ))
};

const getQuestionsByLesson = async lesson => {

    const q = faunadb.query;
    const client = new faunadb.Client({ secret: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo' });

    const texts = lesson.questions.map(question => question.text);

    const questions = await Promise.all(texts.map(async text => {
            const q = await getQuestionByText(text) as any;
            return q.data;
    }));

    return questions;
};

const createQuestion = async (title, text) => {

    const q = faunadb.query;
    const client = new faunadb.Client({ secret: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo' });

    const lesson = getLessonByTitle(title);

    return await client.query(
        q.Create(
            q.Collection("Question"),
            {
                data: {
                    "text": text,
                    "total": 0,
                    "correct": 0,
                    "lesson": lesson
                }
    }));
};

const createQuestions = async lesson => {

    const q = faunadb.query;
    const client = new faunadb.Client({ secret: 'fnAD-5GAWYACB0DznQW7f36Ml1R8fP-_ps7L3cIo' });

    const texts = lesson.questions.map(question => question.text);

    const questions = await Promise.all(texts.map(async text => {
        const q = await createQuestion(lesson.title, text) as any;
        console.log(q);
        return q.data;
    }));

    return questions;
};

export const api = {
    createLesson,
    getLessons,
    getLessonByTitle,
    getQuestionByText,
    getQuestionsByLesson,
    createQuestion,
    createQuestions
}