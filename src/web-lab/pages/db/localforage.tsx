import { useEffect } from 'react'
import { LocalDBService } from '../../lib/localforage'

const Page = (): JSX.Element => {
  useEffect(() => {
    const runner = async () => {
      try {
        const a = {
          hello: 'world',
        }
        // const value = await .getItem('a')
        // await LocalDBService.tableOne.setItem('a', a)

        const value = await LocalDBService.docTable.getItem('a')
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
