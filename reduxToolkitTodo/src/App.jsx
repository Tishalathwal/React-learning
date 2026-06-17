import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import AddTodo from './components/AddTodo'
import Todos from './components/Todos'

function App() {
  
  return (
    <div className="bg-gray-800 min-h-screen text-white text-center">
  <h1 className="text-2xl font-bold text-center mb-4">Learn about redux toolkit</h1>
  <AddTodo />
  <Todos />
</div>
  )
}

export default App
