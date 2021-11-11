import { useEffect } from 'react'
import { dropDatabase, tableOne } from './localforage-db'

const Page = (): JSX.Element => {
  useEffect(() => {
    const runner = async () => {
      try {
        const a = {
          hello: 'world',
        }
        dropDatabase()
        const value = await tableOne.getItem('a')
        console.log(value)
      } catch (err) {
        console.log(err)
      }
    }

    runner()
  }, [])

  return (
    <div className="container">
      <div></div>
    </div>
  )
}

export default Page
