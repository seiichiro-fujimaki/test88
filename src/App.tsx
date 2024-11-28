import { useState } from 'react'
import hason1 from './assets/hason.jpeg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h2>屋根の破損検査</h2>

      <div>
        <a href="https://trust-coms.com/" target="_blank">
          <img src={viteLogo} alt="Vite logo" />
        </a>
        {/* <a href="https://react.dev" target="_blank"> */}
          <img 
          
          src={hason1} 
          height = "200XP"
          width  = "200XP"
          alt="React logo" />

        {/* </a> */}
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
        Click on thes 品田
      </p>
    </>
  )
}

export default App
