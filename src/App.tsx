import { useState } from 'react'
import hason1 from './assets/hason.jpeg'
import hason2 from './assets/hason2.jpeg'
import hason3 from './assets/hason3.jpeg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Authenticator } from '@aws-amplify/ui-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Authenticator>
      {({ signOut }) => (



    <>
      <h2>屋根の破損検査 2024/11/29〇✖✖</h2>

      <div>
        {/* <a href="https://trust-coms.com/" target="_blank">
          <img src={viteLogo} alt="Vite logo" />
        </a> */}

        {/* <a href="https://react.dev" target="_blank"> */}
        <img src={hason1}  height = "300XP"  width  = "300XP"  alt="hason1" className="yane"/>
        <img src={hason2}  height = "300XP"  width  = "300XP"  alt="hason2" className="yane"/> 
        <img src={hason3}  height = "300XP"  width  = "300XP"  alt="hason3" className="yane"/> 

        {/* </a> */}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          検査回数: {count} 
        </button>
      </div>
        
      <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            検査実行
          </button>
      </div>
      <p className="read-the-docs">
      ©TRUST
      </p>

     <button onClick={signOut}>Sign out　〇〇〇</button>
    </>
  )}
   </Authenticator>

  )
}

export default App
