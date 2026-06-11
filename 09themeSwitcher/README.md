# 09themeSwitcher — Theme Switcher with Context API
 
> Builds on Context API knowledge and applies it to a real-world use case — a **Dark/Light theme switcher** using Tailwind CSS v4 and `useEffect`.

---

## 💡 What This Project Does

A product card is displayed on screen. A toggle button at the top lets you switch between **Light Mode** and **Dark Mode**. The entire page theme changes instantly — powered by Context API and Tailwind's dark mode class strategy.

---

## 📁 Project Structure

```
09themeSwitcher/
└── src/
    ├── contexts/
    │   └── theme.js               ← Context + custom hook created here
    ├── components/
    │   ├── ThemeBtn.jsx            ← Toggle switch UI (Consumer)
    │   └── Card.jsx                ← Product card (reacts to theme automatically)
    └── App.jsx                     ← State lives here, Provider wraps everything
index.css                           ← Tailwind v4 setup + dark mode variant here
```

---

## 🚀 Project Setup (Tailwind v4)

```bash
npm create vite@latest 09themeSwitcher -- --template react
cd 09themeSwitcher
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev
```

In `vite.config.js`, add the Tailwind plugin:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

In `index.css`, replace everything with:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

> **Note:** You may see a red underline on `@custom-variant` in VS Code — that's just the CSS linter not recognizing Tailwind v4 syntax. It works perfectly fine. To remove the red line, add `"css.lint.unknownAtRules": "ignore"` to your VS Code settings (`Ctrl + Shift + P` → Open User Settings JSON).

**No `tailwind.config.js` needed in v4.** Everything is handled in `index.css`.

---

## 🧠 Core Concepts — Step by Step

### Step 1 — Smarter Context File (`contexts/theme.js`)

```js
import { createContext, useContext } from "react";

export const ThemeContext = createContext({
    themeMode: "light",
    darkTheme: () => {},
    lightTheme: () => {},
})

export const ThemeProvider = ThemeContext.Provider

export default function useTheme() {
    return useContext(ThemeContext)
}
```

**Three things in one file:**

`createContext()` is given a **default value object** — this defines the shape of the data. `themeMode` starts as `"light"`, and the two functions are empty placeholders.

`ThemeProvider` is just an alias for `ThemeContext.Provider` — so you write `<ThemeProvider>` instead of `<ThemeContext.Provider>` everywhere. Cleaner.

`useTheme()` is a **custom hook** — it wraps `useContext(ThemeContext)` so any component just calls `useTheme()` instead of importing both `useContext` and `ThemeContext`. Much more reusable.

---

### Step 2 — State + useEffect in App (`App.jsx`)

```jsx
import { useEffect, useState } from 'react'
import { ThemeProvider } from './contexts/theme'
import ThemeBtn from './components/ThemeBtn'
import Card from './components/Card'

function App() {
  const [themeMode, setThemeMode] = useState("light")

  const lightTheme = () => { setThemeMode("light") }
  const darkTheme = () => { setThemeMode("dark") }

  useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])

  return (
    <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
      <div className="flex flex-wrap min-h-screen items-center">
        <div className="w-full">
          <div className="w-full max-w-sm mx-auto flex justify-end mb-4">
            <ThemeBtn />
          </div>
          <div className="w-full max-w-sm mx-auto">
            <Card />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
```

**Key points:**

`useState("light")` — current theme tracked as a string, either `"light"` or `"dark"`.

`lightTheme` and `darkTheme` are simple functions that update the state. These are passed into context so any component can trigger a theme change.

`useEffect` — every time `themeMode` changes, it removes both classes from `<html>` and adds the current one. Tailwind then applies all `dark:` styles automatically.

---

### Step 3 — useEffect + DOM Manipulation (The Actual Magic)

```js
useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
}, [themeMode])
```

This directly touches the DOM — adding `"dark"` or `"light"` to the root `<html>` element. The `@custom-variant dark` rule in `index.css` tells Tailwind to activate all `dark:` prefixed styles when the `dark` class is present on `<html>`.

---

### Step 4 — ThemeBtn uses the Custom Hook (`ThemeBtn.jsx`)

```jsx
import useTheme from '../contexts/theme';

export default function ThemeBtn() {
    const { themeMode, lightTheme, darkTheme } = useTheme()

    const onChangeBtn = (e) => {
        const darkModeStatus = e.currentTarget.checked
        if (darkModeStatus) {
            darkTheme()
        } else {
            lightTheme()
        }
    }

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                onChange={onChangeBtn}
                checked={themeMode === "dark"}
            />
            <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full ..."></div>
            <span className="ml-3 text-sm font-medium text-gray-900">Toggle Theme</span>
        </label>
    )
}
```

`useTheme()` — custom hook used here, much cleaner than `useContext(ThemeContext)`.

`checked={themeMode === "dark"}` — the checkbox is **controlled** by context state. If `themeMode` is `"dark"`, the toggle stays checked. This keeps UI in sync with actual state.

`onChangeBtn` — calls `darkTheme()` or `lightTheme()` from context → updates state in `App.jsx` → triggers `useEffect` → updates `<html>` class → Tailwind dark styles activate.

---

## 🔄 Complete Data Flow

```
User clicks toggle
       ↓
ThemeBtn → onChangeBtn()
       ↓
calls darkTheme() or lightTheme() from context
       ↓
App.jsx → setThemeMode("dark" or "light")
       ↓
useEffect fires → adds "dark" or "light" class to <html>
       ↓
Tailwind dark: styles activate/deactivate across ALL components
```

---

## 🆚 08miniContext vs 09themeSwitcher — What's New?

| Feature | 08miniContext | 09themeSwitcher |
|---|---|---|
| Context file | Only `createContext()` | `createContext()` + default value + custom hook |
| Consuming context | `useContext(UserContext)` directly | `useTheme()` custom hook |
| Side effects | None | `useEffect` to update DOM |
| Tailwind dark mode | Not used | `@custom-variant dark` in `index.css` |

---

## 💡 Key Takeaways

1. Pass **default values** to `createContext()` to define the shape of your context upfront
2. **Custom hooks** (`useTheme`) make consuming context cleaner across components
3. `ThemeProvider` as an alias for `ThemeContext.Provider` reduces boilerplate
4. `useEffect` with `[themeMode]` dependency runs only when theme changes — perfect for DOM sync
5. In **Tailwind v4**, dark mode is set via `@custom-variant dark (&:where(.dark, .dark *))` in `index.css` — no config file needed
6. The toggle's `checked` prop controlled by context state = **controlled component** pattern

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
