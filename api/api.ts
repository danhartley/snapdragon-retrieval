import faunadb from 'faunadb';

let q, client, secret;

const logFinally = request => {
    // console.log(`call on: ${request}`);
};

const logError = (e, src = '') => {
    console.log(`Error message: ${e.message}`);
    console.log(`Error stack trace: ${e.stack}`);
    console.log(`Error source: ${src}`);    
};

const init = () => {    
    secret = secret || process.env.NEXT_PUBLIC_SERVER_FAUNA_KEY;
    q = q = faunadb.query;
    client = client = new faunadb.Client({ secret });
};

try {
    init();
} catch(e) {
    logError(e, 'fauna authorisation');
} finally {
    logFinally('fauna authorisation');
}

const clientQuery = async (query, queryName) => {
    try {        
        init();
        const response = await client.query(query);
        return response;
    } catch(e) {
        logError(e, queryName);
    } finally {
        logFinally(queryName);
    }
};

const createLesson = async title => {

    const lesson = await clientQuery(
        q.Create(
        q.Collection("Lesson"),
        {
            data: {
                "title": title
            }
    }), 'createLesson');

    return lesson;
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

    const lesson = await clientQuery(q.Map(
        q.Paginate(
            q.Match(q.Index("lessonByTitle"), title)
        ),
        q.Lambda("X", q.Get(q.Var("X"))))
    , 'getLessonByTitle');

      return lesson;
};

const getQuestionByText = async (text = 'Rice provides approximately what percent of the world\'s calories?') => {

    return clientQuery(q.Map(
        q.Paginate(
            q.Match(q.Index("questionsByQuestionText"), text)
        ),
        q.Lambda("X", q.Get(q.Var("X")))
      ), 'getQuestionByText')
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

    let ref = await getQuestionByText(text);

    if(ref && ref.data && ref.data.length > 0) return ref; // question exists

    return await clientQuery(
        q.Create(
            q.Collection("Question"),
            {
                data: {
                    "text": text,
                    "total": 0,
                    "correct": 0,
                    "lesson": lesson
                }
    }), 'createQuestion');
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

    let ref = await getQuestionByText(question.text);

    console.log('ref: ', ref)

    const response = (ref && ref.data && ref.data.length > 0)
        ? await clientQuery(
                q.Update(
                    q.Ref(q.Collection('Question'), ref.data[0].ref.value.id),
                    {
                        data: { 
                            total: question.total,
                            correct: question.correct
                        }
                    }
                ), 'updateQuestion'
            )
        : null;

    console.log('response: ', response)   

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