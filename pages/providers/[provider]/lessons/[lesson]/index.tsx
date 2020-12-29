import { useRouter } from 'next/router';
import { getLessons } from 'api/lessons/utils';
import { logic } from 'logic/logic';
import Layout from 'components/layout/layout';
import { Card } from 'components/card/card';
import { Question } from 'components/question/question';
import QueryString from 'components/query-string/query-string';
import { enums } from "components/enums";

const Lesson = ({lesson}) => {

    lesson.questions = logic.shuffleArray(lesson.questions);

    const router = useRouter();

    const provider = router.query.provider;
    const type = router.query.type;
    
    return (
        <Layout title="Lesson" description={`${provider} ${lesson.title} lesson`} header={lesson.title} headerLink={lesson.source}>
            <div>
                <QueryString options={enums.LESSON_TYPE} lesson={lesson} />
                { type === enums.LESSON_TYPE.CARDS ? <Card lesson={lesson}></Card> : <Question lesson={lesson}></Question> }
            </div>
        </Layout>
    )
};

export default Lesson;

export async function getStaticProps({params: {provider, lesson}}) {    

    const providerLesson = getLessons().find(l => l.provider === provider && l.slug === lesson);

    const ranked = providerLesson.ranked ? providerLesson.ranked.map(r => r) : [];
    const unranked = providerLesson.unranked 
        ? providerLesson.unranked.map(u => { return { ...u, type: u.type || enums.QUESTION_TYPE.UNORDERED } }) 
        : [];
    const multipleChoice = providerLesson.multiplechoice
        ? providerLesson.multiplechoice.map(m => { return { ...m, type: m.type || enums.QUESTION_TYPE.MULTIPLE_CHOICE } })
        : [];
    const multipleSelect = providerLesson.multipleselect
        ? providerLesson.multipleselect.map(m => { return { ...m, type: m.type || enums.QUESTION_TYPE.MULTIPLE_SELECT } }) 
        : [];

    providerLesson.questions = [ ...ranked, ...unranked, ...multipleChoice, ...multipleSelect ];

    return {
      props: {
        lesson: providerLesson
      },
    }
}

export async function getStaticPaths() {

    const paths = getLessons().map(lesson => {
        return { params: { provider: lesson.provider, lesson: lesson.slug }}
    });

    return { paths, fallback: false }
}