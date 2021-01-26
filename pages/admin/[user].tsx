import { useEffect, useState } from 'preact/hooks';
import { useRouter } from 'next/router';

import users from 'pages/users/users.json';

import { createLessonHistories } from 'api/api-effects';
import { getLessons } from 'api/lessons/utils';

const authenticateUser = (user, password) => {

    return user === 'danielhartley' && password === 'snapdragon';

};

const Admin = ({lessons}) => {

    const router = useRouter();

    const { user, pwd } = router.query;

    const activateLesson = async lesson => {
        const questions = await createLessonHistories(lesson);
        console.log(questions);
        
    };

    if(authenticateUser(user, pwd)) {

        const inActiveLessons = lessons.map(lesson => {
            return <li>
                <section>
                    <div>{lesson.title}</div>
                    <button onClick={activateLesson}>Enable scoring</button>
                </section>
            </li>
        });

        return <ul>{inActiveLessons}</ul>

    } else {
        return (
            <div>You are not authorised!</div>
        )
    }
        
};

export const getStaticProps = async ({params}) => {
    
    let lessons = getLessons().filter(lesson => !lesson.isActive);

    lessons = lessons.map(lesson => {
        return { 
            ...lesson
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