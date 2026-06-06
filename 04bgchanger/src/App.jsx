import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [color, setColor] = useState("olive")

  return (
    <div className ="w-full h-screen duration-200"
    style={{backgroundColor: color}}>
      <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2">
        <div className="flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-3xl">
          <button 
          onClick={() => setColor("red")}
          className="outline-none px-5 py-2 rounded-full text-white shadow-lg"
          style={{backgroundColor: "red"}}
          >red</button>
          
          <button 
          onClick={() => setColor("yellow")}
          className="outline-none px-5 py-2 rounded-full text-white shadow-lg"
          style={{backgroundColor: "yellow"}}
          >yellow</button>
          
          <button 
          onClick={() => setColor("green")}
          className="outline-none px-5 py-2 rounded-full text-white shadow-lg"
          style={{backgroundColor: "Green"}}
          >green</button>
          
          <button 
          onClick={() => setColor("blue")}
          className="outline-none px-5 py-2 rounded-full text-white shadow-lg"
          style={{backgroundColor: "blue"}}
          >blue</button>
          
          <button 
          onClick={() => setColor("purple")}
          className="outline-none px-5 py-2 rounded-full text-white shadow-lg"
          style={{backgroundColor: "purple"}}
          >purple</button>
          
          <button 
          onClick={() => setColor("grey")}
          className="outline-none px-5 py-2 rounded-full text-white shadow-lg"
          style={{backgroundColor: "grey"}}
          >grey</button>
          
          <button 
          onClick={() => setColor("orange")}
          className="outline-none px-5 py-2 rounded-full text-white shadow-lg"
          style={{backgroundColor: "orange"}}
          >orange</button>
        </div>
      </div>
      

    </div>
  )
}

export default App
