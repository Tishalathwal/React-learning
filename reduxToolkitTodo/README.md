# Redux Toolkit Todo App — Notes

Project: `reduxToolkitTodo`

Concept: Moving from Context API to Redux Toolkit for global state management

---

## 1. Why Redux Toolkit?

Context API works fine for small apps, but it has problems at scale:
- Every consumer component re-renders when context value changes, even if it doesn't need the updated part.
- No built-in dev tools to inspect state changes.
- Manually writing reducers, action types, and action creators (old-school Redux) is verbose.

Redux Toolkit (RTK) is the official, modern way to use Redux. It removes boilerplate and gives you:
- A single centralized **store**
- Auto-generated **actions** from reducer names
- Built-in **Immer** so you can write "mutating" code inside reducers safely
- Redux DevTools support out of the box

---

## 2. Installation

```bash
npm install @reduxjs/toolkit react-redux
```

- `@reduxjs/toolkit` → core RTK APIs (`configureStore`, `createSlice`)
- `react-redux` → React bindings (`Provider`, `useSelector`, `useDispatch`)

---

## 3. Folder Structure Used

```
src/
├── app/
│   └── store.js
├── features/
│   └── todo/
│       └── todoSlice.js
├── components/
│   ├── AddTodo.jsx
│   └── Todos.jsx
├── App.jsx
├── index.css
└── main.jsx
```

The `features/` folder pattern groups state logic by feature (here, "todo"), which is the recommended RTK convention.

---

## 4. Core Concepts

| Term | Meaning |
|---|---|
| **Store** | Single source of truth for the whole app's state |
| **Slice** | A piece of state + its reducers for one feature, created with `createSlice()` |
| **Reducer** | Function describing how a piece of state changes in response to an action |
| **Action** | Auto-generated object describing "what happened" (e.g. `addTodo`) |
| **Dispatch** | Function used to send an action to the store (`useDispatch()`) |
| **Selector** | Function used to read a piece of state from the store (`useSelector()`) |

---

## 5. todoSlice.js — State Logic

```javascript
import { createSlice, nanoid } from "@reduxjs/toolkit"

const initialState = {
  todos: [{ id: 1, text: "Hello world" }]
}

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const todo = {
        id: nanoid(),
        text: action.payload
      }
      state.todos.push(todo)
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload)
    }
  }
})

export const { addTodo, removeTodo } = todoSlice.actions
export default todoSlice.reducer
```

**Key points:**
- `createSlice()` needs a `name`, `initialState`, and `reducers` object.
- Each function inside `reducers` automatically becomes an action creator — no manual `dispatch({ type: "ADD_TODO", payload })` needed.
- Thanks to **Immer** (used internally by RTK), you can write `state.todos.push(todo)` directly instead of returning a new array manually. It looks like mutation but Immer handles immutability behind the scenes.
- `nanoid()` generates a unique ID for each todo (imported from `@reduxjs/toolkit`, no separate package needed).

---

## 6. store.js — Configuring the Store

```javascript
import { configureStore } from "@reduxjs/toolkit"
import todoReducer from "../features/todo/todoSlice"

export const store = configureStore({
  reducer: todoReducer
})
```

- `configureStore()` sets up the store with good defaults (DevTools enabled, middleware like `redux-thunk` included automatically).
- The `reducer` key maps state slice names to their reducer functions. If you only have one slice, you can pass it directly; with multiple slices, you'd nest them: `reducer: { todos: todoReducer, user: userReducer }`.

---

## 7. main.jsx — Connecting Store to React

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { store } from './app/store.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
```

- `<Provider>` wraps the whole app and makes the Redux store available to any component, no matter how deeply nested — solving the prop-drilling problem Context API was also trying to solve, but with better performance characteristics for frequent updates.

---

## 8. AddTodo.jsx — Dispatching Actions

```jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../features/todo/todoSlice'

function AddTodo() {
  const [input, setInput] = useState('')
  const dispatch = useDispatch()

  const addTodoHandler = (e) => {
    e.preventDefault()
    dispatch(addTodo(input))
    setInput('')
  }

  return (
    <form onSubmit={addTodoHandler} className="space-x-3 mt-12">
      <input
        type="text"
        className="bg-gray-800 rounded border border-gray-700 ..."
        placeholder="Enter a Todo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="text-white bg-indigo-500 ...">
        Add Todo
      </button>
    </form>
  )
}

export default AddTodo
```

**Flow:**
1. Local state (`input`) tracks what's typed — this is normal `useState`, not Redux. Form inputs typically stay local until submission.
2. `useDispatch()` gives access to the `dispatch` function.
3. On submit, `dispatch(addTodo(input))` sends the `addTodo` action with `input` as the payload.
4. `e.preventDefault()` stops the page from reloading (default form behavior).
5. `setInput('')` clears the field after submission.

---

## 9. Todos.jsx — Reading State & Removing Items

```jsx
import { useSelector, useDispatch } from 'react-redux'
import { removeTodo } from '../features/todo/todoSlice'

function Todos() {
  const todos = useSelector(state => state.todos)
  const dispatch = useDispatch()

  return (
    <>
      <div>Todos</div>
      <ul className="list-none">
        {todos.map((todo) => (
          <li key={todo.id} className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded">
            <div className="text-white">{todo.text}</div>
            <button onClick={() => dispatch(removeTodo(todo.id))} className="...">
              {/* trash icon SVG */}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Todos
```

**Flow:**
1. `useSelector(state => state.todos)` reads the todos array from the store. The function passed in tells Redux exactly which slice of state you want.
2. `.map()` renders each todo as a list item — same pattern as rendering any array in React.
3. `key={todo.id}` is required by React for list rendering performance/diffing.
4. Clicking delete calls `dispatch(removeTodo(todo.id))`, sending the todo's ID so the reducer knows which one to filter out.

---

## 10. Common Errors & Fixes (from debugging this project)

| Error / Symptom | Likely Cause | Fix |
|---|---|---|
| `Could not find store` | Forgot to wrap app in `<Provider>` | Wrap `<App />` with `<Provider store={store}>` in `main.jsx` |
| Todo text not displaying | `text` field empty in state, or wrong key used in `{todo.text}` | Check actual state shape in Redux DevTools |
| UI not centered like reference | Missing wrapper `<div>` with `text-center` / flex centering classes | Add a wrapping div in `App.jsx` with proper Tailwind classes |
| Tailwind classes not applying as expected | Tailwind v3 vs v4 syntax mismatch in `index.css` | v4 uses `@import "tailwindcss";`, v3 uses `@tailwind base/components/utilities;` |
| State "mutated" directly but works fine | This is expected — RTK uses Immer internally | No fix needed, this is correct RTK behavior |

---

## 11. Interview-Style Questions (Quick Revision)

1. **Q: Why use Redux Toolkit instead of plain Redux?**
   A: RTK reduces boilerplate — no manual action types/creators, includes Immer for simpler reducer logic, and has sensible defaults (DevTools, thunk) built into `configureStore()`.

2. **Q: What does `createSlice()` return?**
   A: An object containing the auto-generated `actions` (one per reducer function) and the slice's `reducer` function, which gets passed to the store.

3. **Q: How is RTK able to let you "mutate" state directly inside reducers?**
   A: It uses Immer under the hood, which tracks the "mutations" you write and produces a new immutable state object automatically.

4. **Q: Difference between `useSelector` and `useDispatch`?**
   A: `useSelector` reads data from the store; `useDispatch` lets you send actions to update the store.

5. **Q: Why does each todo need a unique `id`?**
   A: React uses it as the `key` prop for efficient list rendering, and it's also used to identify exactly which todo to remove via `removeTodo(id)`.

6. **Q: What's the role of `<Provider>`?**
   A: It makes the Redux store accessible to every component in the component tree without manual prop passing, similar in spirit to Context API but built for Redux's store.

---

## 12. Key Differences vs Context API (from previous lecture)

| Aspect | Context API | Redux Toolkit |
|---|---|---|
| Boilerplate | Less initial setup | Slightly more setup, but scales better |
| Re-renders | All consumers re-render on any context change | More optimized — `useSelector` only re-renders on relevant state change |
| Dev Tools | None built-in | Redux DevTools extension support |
| Best for | Small/medium apps, simple shared state | Larger apps, complex or frequently-updated state |

---

*Push this project to GitHub repo `React-learning` with this file as `README.md` or `NOTES.md` inside the `reduxToolkitTodo` folder, following the same pattern as previous lecture projects.*