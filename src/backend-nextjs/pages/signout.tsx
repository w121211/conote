import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSignOutMutation } from '../apollo/query.graphql'
import { useApolloClient } from '@apollo/client'

function SignOutPage(): JSX.Element {
  const client = useApolloClient()
  const router = useRouter()
  const [signOut] = useSignOutMutation()

  useEffect(() => {
    async function run() {
      await signOut()
      await client.resetStore()
      router.push('/')
    }
    run().catch(console.error)
  }, [signOut, router, client])

  return <p>Signing out...</p>
}

export default SignOutPage
