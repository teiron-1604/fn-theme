import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-success">Vite + React</h1>

      <div className="w-layout-10 h-layout-10 max-w-app-width min-h-layout-5 mx-auto bg-surface-dim rounded-size-sm border-1 border-solid border-success">
        <h2 className="text-secondary">Hello</h2>
      </div>

      <div className="w-30 h-30 mx-auto bg-error rounded-size-popup border-1 border-solid border-success">
        <h2 className="text-secondary">Hello</h2>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
