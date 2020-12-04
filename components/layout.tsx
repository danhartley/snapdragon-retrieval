import Link from 'next/link'
import Head from 'next/head'

export default function Layout({
  children,
  title = 'This is the default title',
}) {
  return (
    <>
        <Head>
            <title>{title}</title>
            <meta http-equiv="content-type" content="text/html;charset=utf-8"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes"></meta>
            <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap" rel="stylesheet" />
        </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          |
          <Link href="/about">
            <a>About</a>
          </Link>{' '}
          |
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </nav>
      </header>

      {children}

      <footer>{'I`m here to stay'}</footer>
    </>
  )
}