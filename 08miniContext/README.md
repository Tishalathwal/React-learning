# 08miniContext — React Context API
 
> This project teaches React's **Context API**, which lets you share data across any component without passing props manually.

---

## 🤔 The Problem — What is Prop Drilling?

In normal React, if a parent component has some data that a deeply nested child needs, you have to pass it through every component in between — even if those middle components don't need it at all. This is called **Prop Drilling**.

```
App (user data lives here)
 └── Layout (just passing it down)
      └── Sidebar (just passing it down)
           └── Profile (this is where it was actually needed)
```

**Context API** solves this — any component can directly access the data, no matter how deep it is.

---

## 📁 Project Structure

```
08miniContext/
└── src/
    ├── context/
    │   ├── UserContext.js          ← Create the context (the channel)
    │   └── UserContextProvider.jsx ← Hold state here + wrap app with Provider
    ├── components/
    │   ├── Login.jsx               ← Sets user data into context (Consumer)
    │   └── Profile.jsx             ← Reads user data from context (Consumer)
    └── App.jsx                     ← Wraps everything with the Provider
```

---

## 🧠 Core Concepts — Step by Step

### Step 1 — Create the Context (`UserContext.js`)

```js
import React from 'react'

const UserContext = React.createContext()

export default UserContext
```

`React.createContext()` creates an **empty context object**.  

---

### Step 2 — Build the Provider (`UserContextProvider.jsx`)

```jsx
import React, { useState } from 'react'
import UserContext from './UserContext'

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
```

**What's happening here?**
- `useState(null)` holds the `user` state — initially no user is logged in
- `UserContext.Provider` is given a `value` prop containing both `user` and `setUser`
- `{children}` means every component wrapped inside this Provider will have access to that value

---

### Step 3 — Wrap the App with the Provider (`App.jsx`)

```jsx
import UserContextProvider from './context/UserContextProvider'
import Login from './components/Login'
import Profile from './components/Profile'

function App() {
  return (
    <UserContextProvider>
      <h1>React with Chai and share is important</h1>
      <Login />
      <Profile />
    </UserContextProvider>
  )
}
```

Both `Login` and `Profile` are inside `UserContextProvider` — so both get direct access to `user` and `setUser` without any props being passed.

---

### Step 4 — Login Component — SET data into context (`Login.jsx`)

```jsx
import React, { useState, useContext } from 'react'
import UserContext from '../context/UserContext'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { setUser } = useContext(UserContext)  // ← Pull setUser from context

    const handleSubmit = (e) => {
        e.preventDefault()
        setUser({ username, password })  // ← Update the context
    }

    return (
        <div>
            <h2>Login</h2>
            <input type='text' value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='username' />
            {" "}
            <input type='text' value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password' />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}
```

**Key point:** `useContext(UserContext)` gives access to `setUser`. On form submit, it updates the context — and now that data is available **everywhere in the app**.

---

### Step 5 — Profile Component — READ data from context (`Profile.jsx`)

```jsx
import React, { useContext } from 'react'
import UserContext from '../context/UserContext'

function Profile() {
    const { user } = useContext(UserContext)  // ← Pull user from context

    if (!user) return <div>please login</div>

    return <div>Welcome {user.username}</div>
}
```

**Key point:** `Profile` received zero props — it pulled `user` directly from context.  
If `user` is null → show "please login". After login → show "Welcome [username]".

---

## 🔄 Data Flow Diagram

```
UserContextProvider
  │
  │  value = { user, setUser }
  │
  ├── Login
  │     useContext → calls setUser({ username, password })
  │                              ↓
  └── Profile              Context updates
        useContext → reads user.username and displays it
```

User fills in the form → hits Submit → `setUser` is called → context updates → Profile automatically re-renders and shows the username.

---

## ⚙️ useContext Hook — Summary

```js
const { user, setUser } = useContext(UserContext)
```

- `useContext` is a React hook
- Pass in the context object (the one created with `createContext()`)
- It returns the `value` that the Provider passed in
- Can be used in **any component**, no matter how deeply nested

---

## 🆚 Context API vs Props

| Feature | Props | Context API |
|---|---|---|
| Data sharing | Parent → Child only | Any component anywhere |
| Deep nesting | Causes prop drilling | Direct access |
| Use case | Simple, local data | Global data (user, theme, language) |
| Boilerplate | Minimal | A little setup needed |

---

## 🚀 Project Setup

```bash
npm create vite@latest 08miniContext -- --template react
cd 08miniContext
npm install
npm run dev
```

---

## 💡 Key Takeaways

1. **`createContext()`** — Create the context once (just a channel, no data yet)
2. **`Provider`** — Hold the state here, pass it via the `value` prop, wrap your app
3. **`useContext()`** — Consume the context in any component
4. Always pass both the state and the setter in `value` so components can both read and update
5. This pattern is ideal for **Auth/Login**, **Theme Switching**, **Language** and other global state

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
