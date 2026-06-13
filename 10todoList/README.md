# Context API with Local Storage (Todo App)

## What Did We Learn?

Built a Todo App where:
- Todos can be **added, edited, deleted, and toggled**
- **Context API** is used to share data across all components
- **Local Storage** is used so todos persist even after page refresh

---

## 1. Why Context API?

**Problem — Prop Drilling:**
```
App → Parent → Child → DeepChild
```
If only `DeepChild` needs the data, we still had to pass props through every component in between. This is called "Prop Drilling."

**Solution — Context API:**
> Data can be accessed directly by any component — no need to involve the components in between.

---

## 2. Project Structure

```
src/
├── contexts/
│   └── TodoContext.js
├── components/
│   ├── TodoForm.jsx
│   └── TodoItem.jsx
└── App.jsx
```

---

## 3. TodoContext.js

```js
import { createContext, useContext } from "react"

export const TodoContext = createContext({
    todos: [
        {
            id: 1,
            todo: "Todo msg",
            completed: false,
        }
    ],
    addTodo: (todo) => {},
    updateTodo: (id, todo) => {},
    deleteTodo: (id) => {},
    toggleComplete: (id) => {}
})

export const useTodo = () => {
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider
```

### Three things here:

| Thing | Purpose |
|---|---|
| `createContext(default)` | Creates the context — default value is provided so the app doesn't crash if there's no Provider |
| `useTodo()` | Custom Hook — shortcut for `useContext(TodoContext)` so we don't repeat it everywhere |
| `TodoProvider` | Short name for `TodoContext.Provider` |

---

## 4. App.jsx

```jsx
import { useState, useEffect } from "react"
import { TodoProvider } from "./contexts/TodoContext"
import TodoForm from "./components/TodoForm"
import TodoItem from "./components/TodoItem"

function App() {
  const [todos, setTodos] = useState([]) // array to store the list of todos

  const addTodo = (todo) => {
    setTodos((prev) => [{id: Date.now(), ...todo}, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) =>
      prevTodo.id === id ? todo : prevTodo
    ))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((prevTodo) =>
      prevTodo.id === id
      ? {...prevTodo, completed: !prevTodo.completed}
      : prevTodo
    ))
  }

  // Load todos from Local Storage when app first opens
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"))
    if (todos && todos.length > 0) {
      setTodos(todos)
    }
  }, [])

  // Save todos to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  return (
    <TodoProvider value={{todos, addTodo, updateTodo, deleteTodo, toggleComplete}}>
      <div>
        <TodoForm />
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </TodoProvider>
  )
}

export default App
```

### Important Points:

| Code | Meaning |
|---|---|
| `useState([])` | Todos are stored in an array — empty at the start |
| `Date.now()` | Gives each todo a unique id (timestamp) |
| `TodoProvider value={...}` | Whatever is in `value` is available to all child components |
| `useEffect(fn, [])` | Runs only once — when the app loads |
| `useEffect(fn, [todos])` | Runs every time todos change |

---

## 5. TodoForm.jsx

```jsx
import { useState } from "react"
import { useTodo } from "../contexts/TodoContext"

function TodoForm() {
    const [todo, setTodo] = useState("")
    const { addTodo } = useTodo() // get addTodo function from Context

    const add = (e) => {
        e.preventDefault() // prevents page reload
        if (!todo) return  // don't add empty todo
        addTodo({ todo, completed: false })
        setTodo("") // clear input after adding
    }

    return (
        <form onSubmit={add}>
            <input
                type="text"
                placeholder="Write Todo..."
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <button type="submit">Add</button>
        </form>
    )
}

export default TodoForm
```

### Important Points:

| Code | Meaning |
|---|---|
| `const { addTodo } = useTodo()` | Pulling only `addTodo` from Context |
| `e.preventDefault()` | Stops the browser from reloading the page on form submit |
| `setTodo("")` | Clears the input box after todo is added |

---

## 6. TodoItem.jsx

```jsx
import { useState } from "react"
import { useTodo } from "../contexts/TodoContext"

function TodoItem({ todo }) {
    const [isTodoEditable, setIsTodoEditable] = useState(false)
    const [todoMsg, setTodoMsg] = useState(todo.todo)
    const { updateTodo, deleteTodo, toggleComplete } = useTodo()

    const editTodo = () => {
        updateTodo(todo.id, { ...todo, todo: todoMsg })
        setIsTodoEditable(false)
    }

    const toggleCompleted = () => {
        toggleComplete(todo.id)
    }

    return (
        <div>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={toggleCompleted}
            />
            <input
                type="text"
                value={todoMsg}
                readOnly={!isTodoEditable}
                onChange={(e) => setTodoMsg(e.target.value)}
            />
            <button onClick={() => {
                if (isTodoEditable) editTodo()
                else setIsTodoEditable(true)
            }}>
                {isTodoEditable ? "Save" : "Edit"}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>
                Delete
            </button>
        </div>
    )
}

export default TodoItem
```

### Important Points:

| Code | Meaning |
|---|---|
| `isTodoEditable` | Tracks whether edit mode is on or off |
| `readOnly={!isTodoEditable}` | When edit mode is off, input is locked (read only) |
| `isTodoEditable ? "Save" : "Edit"` | Edit on → show "Save", Edit off → show "Edit" |

---

## 7. Local Storage

> Data is saved in the browser — it persists even after page refresh or closing the tab

| Method | Purpose |
|---|---|
| `localStorage.setItem("key", value)` | Save data |
| `localStorage.getItem("key")` | Get data |
| `JSON.stringify(data)` | Convert Object/Array to string (for saving) |
| `JSON.parse(data)` | Convert string back to Object/Array (for loading) |

---

## 8. Key Concepts Summary

| Concept | In One Line |
|---|---|
| **Context API** | Share data directly with any component — no prop drilling |
| **createContext** | Creates a context with a default value (fallback) |
| **useContext** | Reads data from a context |
| **Custom Hook** | Reusable logic — avoids repeating the same code |
| **Provider** | Broadcasts data to all child components |
| **Local Storage** | Saves data permanently in the browser |
| **useEffect** | Handles side effects — data fetching, saving, etc. |

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
