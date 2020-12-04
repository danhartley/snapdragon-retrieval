import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
            <meta http-equiv="content-type" content="text/html;charset=utf-8"></meta>
            <link rel="preload" href="public/fonts/open-sans-v17-latin-regular.woff" as="font" type="font/woff2" />
            <link href="public/fonts/open-sans-v17-latin-regular.woff2" as="font" type="font/woff2" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument