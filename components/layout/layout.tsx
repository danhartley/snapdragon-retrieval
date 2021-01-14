import { useRouter } from 'next/router';
import Link from 'next/link'
import Head from 'next/head'

import styles from 'components/layout/layout.module.scss';

export default function Layout({
  children,
  title = 'This is the default title',
  description = 'Lesson retrieval',
  header = '',
  headerLink = '',
  disableNavigation = false
}) {

    const router = useRouter();

    const { provider, lesson, widget } = router.query;

    if(widget) {
        document.querySelector('body').setAttribute("style", "padding: 0;");
    }

    return (
        !widget ? 
            <div class={styles.container}>
                <Head>
                    <title>{title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes"></meta>
                    <meta name="description" content={description}></meta>
                </Head>
                <header>
                    <nav class={disableNavigation ? 'disableDisplay' : null }>
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
                            <span class={styles.date}>{new Date().toDateString()}</span>
                            <span>
                                <Link href={`/users/anonymous`}>
                                    <a>Dashboard</a>
                                </Link>
                            </span>
                        </div>
                    </nav>
                </header>
                
                { headerLink !== '' ? <h1><a target="_blank" href={headerLink}>{header.charAt(0).toUpperCase() + header.slice(1)}</a></h1> : <h1>{header}</h1> }

                {children}

                <footer>© Daniel Hartley 2020. All rights reserved.</footer>
            </div>
            :
            <div class={styles.container}>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes"></meta>
                <meta name="description" content={description}></meta>
            </Head>
            <header><h1>{header}</h1></header>
            {children}
        </div>
    )
}