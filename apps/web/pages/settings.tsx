import { useMe } from '../components/auth/use-me'

const Page = (): JSX.Element | null => {
  const { me } = useMe()

  return (
    <div>
      <h1>Settings</h1>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  }
}

export default Page
