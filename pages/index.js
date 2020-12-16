import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { enums } from 'components/enums';
import Link from 'next/link'
import { MultipleChoice } from 'components/multiple-choice/multiple-choice';

import Layout from 'components/layout/layout';

const Home = () => {
  return (
    <Layout title="Home">
        <main>
            <h1>Snapdragon retrieval</h1>
            <Link href="/providers">
                <a>Providers</a>
            </Link>
            <MultipleChoice type={enums.MULTIPLE_CHOICE_TYPE.RADIO_BUTTONS} />
        </main>
    </Layout>
  )
}

export default Home;
