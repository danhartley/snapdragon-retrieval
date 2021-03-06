import Link from 'next/link'
import Layout from 'components/layout/layout';

const Home = () => {

  return (
    <Layout title="Home" header={"Welcome"}>
        <main>
            <Link href="/providers">
                <a>Providers</a>
            </Link>
        </main>
    </Layout>
  )
}

export default Home;
