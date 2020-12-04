import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import Head from 'next/head';
import Link from 'next/link'

import Layout from 'components/layout';

const Home = () => {
  return (
    <Layout title="Home">
        {/* <Head>
            <title></title>
            <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap" rel="stylesheet" />
        </Head> */}
        <main>
        <h1>Snapdragon retrieval</h1>
        <Link href="/providers">
            <a>Providers</a>
        </Link>
        </main>
    </Layout>
  )
}

export default Home;
