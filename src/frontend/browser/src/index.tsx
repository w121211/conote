import * as React from 'react'
import { render } from 'react-dom'
// import App from './components/App'

const rootEl = document.getElementById('root')

function App(): JSX.Element {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}

render(<App />, rootEl)
