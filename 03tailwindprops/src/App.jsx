import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Card from './card'


function App() {
  const [count, setCount] = useState(0)

  let myObj = {
    username: "tisha",
    age: 22
  }
  let newArr = [1, 2, 3]


  return (
    <>
      <h1 className='bg-green-100 text-black p-4 rounded-xl mb-4'>Tailwind test</h1>
      <Card username="chaiaurcode" btnText="click me" />
      <Card username="Tisha" />
    </>
  )
}

export default App
