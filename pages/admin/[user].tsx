import { useEffect, useState } from 'preact/hooks';
import { useRouter } from 'next/router';

import users from 'pages/users/users.json';

import { logic } from 'logic/logic';
import { createLessonHistories } from 'api/api-effects';
import { getLessons } from 'api/lessons/utils';

import styles from 'pages/admin/admin.module.scss';

import Layout from 'components/layout/layout';

const authenticateUser = (user, password) => {

    return user === 'danielhartley' && password === 'snapdragon';

};

const Admin = ({lessons}) => {

    const router = useRouter();

    const { user, pwd } = router.query;

    const [activeLessons, setActiveLessons] = useState(lessons);

    const activateLesson = async lesson => {        
        const questions = await createLessonHistories(lesson);
        if(questions) {
            const activeLesson = activeLessons.find(l => l.title === lesson.title);
            activeLesson.disabled = true;
            setActiveLessons([ ...lessons, activeLesson ])
        }        
    };

    if(authenticateUser(user, pwd)) {

        const inActiveLessons = activeLessons.map(lesson => {
            return <li class={`${styles.li}`}>
                    <div class={`${lesson.isActive ? styles.active : styles.inactive}`}>{lesson.title}</div>                    
                    <div class={styles.group}>
                        <button disabled={lesson.disabled} onClick={() => activateLesson(lesson)}>Add/update scoring</button>
                        <span>{lesson.questions.length}</span>
                    </div>
                  </li>
        });

        return  (
            <Layout title="User" description={'Admin page'} header={'Admin'}>
                <ul>{inActiveLessons}</ul>
            </Layout>
        )

    } else {
        return (
            <Layout title="User" description={'Admin page'} header={'Admin'}>
                <div>You are not authorised!</div>
            </Layout>
        )
    }
        
};

export const getStaticProps = async ({params}) => {
    
    let lessons = getLessons() as any;
    
    lessons = lessons.map(lesson => {
        return { 
            ...lesson, questions: logic.groupQuestionsAsItems(lesson)
        } as any;
    }) as Array<any>;

    return {
        props: {
            user: params.user,
            lessons
        }
    }
};

export const getStaticPaths = async () => {
    
    const paths = users.usersList.map(user => `/admin/${user.slug}`);

    return {
        paths,
        fallback: false
    };
};

export default Admin;