import { useRouter } from 'next/router';
import Link from 'next/link'
import Head from 'next/head'

import styles from 'components/layout/layout.module.scss';

export default function Layout({
  children,
  title = 'This is the default title',
  description = 'Lesson retrieval'
}) {

    const router = useRouter();

    const { provider, lesson } = router.query;

    return (
        <div class={styles.container}>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes"></meta>
                <meta name="description" content={description}></meta>
            </Head>
            <header>
                <nav>
                    <div>
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                        |
                        <Link href="/providers">
                            <a>Providers</a>
                        </Link>
                        { (provider && lesson) ?
                            <>
                                |
                                <Link href={`/providers/${provider}/lessons`}>
                                    <a>Lessons</a>
                                </Link>
                            </> 
                            : null
                        }
                    </div>
                    <div>
                        <span>
                            <Link href={`/users/danielhartley`}>
                                <a>User</a>
                            </Link>
                        </span>
                    </div>
                </nav>
            </header>

            {children}

            <footer>Score: 1 out of 12</footer>
        </div>
    )
}