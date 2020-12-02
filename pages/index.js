import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import Link from 'next/link'

const Home = () => {
  return (
    <main>
      <h1>Snapdragon retrieval</h1>
      <Link href="/providers">
        <a>Providers</a>
      </Link>
    </main>
  )
}

export default Home;
