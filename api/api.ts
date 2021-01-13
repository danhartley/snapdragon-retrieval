import faunadb from 'faunadb';

let q, client;

const logFinally = request => {
    console.log(`call on: ${request}`);
    console.log(`client: ${client}`);
    
};

const logError = e => {
    console.log(`Error message: ${e.message}`);
    console.log(`Error stack trace: ${e.stack}`);
    console.log(`key: ${process.env.NEXT_PUBLIC_FAUNA_KEY}`);
};


try {
    q = faunadb.query;
    client = new faunadb.Client({ secret: process.env.NEXT_PUBLIC_FAUNA_KEY });
} catch(e) {
    logError(e);
} finally {
    logFinally('fauna authorisation');
}

const createLesson = async title => {

    try {
        const lesson = await client.query(
            q.Create(
                q.Collection("Lesson"),
                {
                    data: {
                        "title": title
                    }
            }));
        
        return lesson;
    } catch(e) {
        logError(e);
    } finally {
        logFinally('createLesson');
    }
};

const getLessons = async () => {

    const lessons = await client.query(q.Map(
        q.Paginate(
            q.Match(q.Index("allLessons"))
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      ));

      return lessons;
};

const getLessonByTitle = async (title = '39 Ways to Save the Planet: #1 Super Rice') => {

    const lesson = await client.query(q.Map(
        q.Paginate(
            q.Match(q.Index("lessonByTitle"), title)
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      ));

      return lesson;
};

const getQuestionByText = async (text = 'Rice provides approximately what percentage of the world\'s calories?') => {

    return client.query(q.Map(
        q.Paginate(
            q.Match(q.Index("questionsByQuestionText"), text)
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      ))
};

const getQuestionsByLesson = async lesson => {

    const texts = lesson.questions.map(question => question.text);

    const questions = await Promise.all(texts.map(async text => {
            const q = await getQuestionByText(text) as any;
            return q.data;
    }));

    return questions;
};

const createQuestion = async (title, text) => {

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

    const texts = lesson.questions.map(question => question.text);

    const questions = await Promise.all(texts.map(async text => {
        const q = await createQuestion(lesson.title, text) as any;
        return q.data;
    }));

    return questions;
};

const updateQuestion = async question => {

    let ref = await getQuestionByText(question.text) as any;
        ref = ref.data[0].ref.value.id;

    const response = await client.query(
        q.Update(
            q.Ref(q.Collection('Question'), ref),
            {
                data: { 
                    total: question.total,
                    correct: question.correct
                }
            }
        )
    );

    return response;    
};

export const api = {
    createLesson,
    getLessons,
    getLessonByTitle,
    getQuestionByText,
    getQuestionsByLesson,
    createQuestion,
    createQuestions,
    updateQuestion
}