import { useRouter } from 'next/router';
import Link from 'next/link'
import Head from 'next/head'

export default function Layout({
  children,
  title = 'This is the default title',
  description = 'Lesson retrieval'
}) {

    const router = useRouter();

    const { provider, lesson } = router.query;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes"></meta>
                <meta name="description" content={description}></meta>
            </Head>
            <header>
                <nav>
                <Link href="/">
                    <a>Home</a>
                </Link>{' '}
                |
                <Link href="/providers">
                    <a>Providers</a>
                </Link>{' '}
                { (provider && lesson) ?
                    <span>
                        |
                        <Link href={`/providers/${provider}/lessons`}>
                            <a>Lessons</a>
                        </Link>
                    </span> 
                    : null
                }
                </nav>
            </header>

            {children}

            <footer>{'I`m here to stay'}</footer>
        </>
    )
}