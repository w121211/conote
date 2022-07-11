import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useMeContext } from '../frontend/components/auth/use-me-context'

const Page = (): JSX.Element | null => {
  const { me } = useMeContext()

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
