import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  
  const increaseValue = ()=>{
    if(count<20) setCount(count+1)
  }
  const decreaseValue = ()=>{
    if(count>0) setCount(count-1)
  }
  return (
    <>
    <h1>counter using hooks</h1>
    <h2>counter: {count}</h2>

    <button onClick={increaseValue}>increase value</button><br />
    <button onClick={decreaseValue}>decrease value</button>
    </>
  )
}

export default App
