
  
### Project: Password Generator

---

## Project Overview

A password generator app where the user can:
- Set password length (via a range slider)
- Toggle numbers allowed
- Toggle special characters allowed
- Copy password to clipboard

---

## Hooks Used

---

## 1. useState

### Why?
To store and update values that change in the UI — length, checkboxes, generated password.

### How it was used?

```js
const [length, setLength] = useState(8)
const [numberAllowed, setNumberAllowed] = useState(false)
const [charAllowed, setCharAllowed] = useState(false)
const [password, setPassword] = useState("")
```

### What it does?
Every time these values change, React re-renders the component with updated UI.

---

## 2. useCallback

### Why?
`passwordGenerator` function was being recreated on every render — wasteful. `useCallback` memoizes (saves) the function so it only recreates when dependencies change.

### How it was used?

```js
const passwordGenerator = useCallback(() => {
  let pass = ""
  let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

  if (numberAllowed) str += "0123456789"
  if (charAllowed) str += "!@#$%^&*()_+"

  for (let i = 1; i <= length; i++) {
    let char = Math.floor(Math.random() * str.length)
    pass += str.charAt(char)
  }

  setPassword(pass)
}, [length, numberAllowed, charAllowed])
```

### What it does?
- Builds the password string based on selected options
- Only re-runs when `length`, `numberAllowed`, or `charAllowed` changes
- Without `useCallback`, this function would recreate on every render unnecessarily

---

## 3. useEffect

### Why?
We want `passwordGenerator` to run automatically whenever `length`, `numberAllowed`, or `charAllowed` changes — not manually.

### How it was used?

```js
useEffect(() => {
  passwordGenerator()
}, [length, numberAllowed, charAllowed, passwordGenerator])
```

### What it does?
- Runs `passwordGenerator()` on first render (component mount)
- Runs again whenever any dependency in the array changes
- This is why password auto-updates when you move the slider or toggle a checkbox

### useEffect 3 behaviors:

```js
useEffect(() => {}, [])        // runs only once — on mount
useEffect(() => {})             // runs on every render
useEffect(() => {}, [value])   // runs when `value` changes
```

---

## 4. useRef

### Why?
To directly access the password input field in the DOM — needed for selecting text when user clicks "Copy".

### How it was used?

```js
const passwordRef = useRef(null)

// attached to input element
<input ref={passwordRef} value={password} readOnly />

// in copy function
const copyPasswordToClipboard = useCallback(() => {
  passwordRef.current?.select()
  passwordRef.current?.setSelectionRange(0, 999)
  window.navigator.clipboard.writeText(password)
}, [password])
```

### What it does?
- `useRef` gives a direct reference to the DOM element
- `passwordRef.current.select()` highlights the text in the input field
- `clipboard.writeText()` copies the password
- Unlike `useState`, changing a ref does NOT cause a re-render

---

## Hook Summary

| Hook | Why used | Re-renders? |
|------|----------|-------------|
| `useState` | Store length, toggles, password value | Yes |
| `useCallback` | Memoize password generator function | No |
| `useEffect` | Auto-run generator when dependencies change | No (triggers others) |
| `useRef` | Access DOM input element for copy feature | No |

---

## Key Concepts

- **Memoization** — saving a computed result so it's not recalculated unnecessarily (`useCallback` does this for functions)
- **Dependencies array** — the `[]` in `useEffect` and `useCallback` controls when they re-run
- **`ref.current`** — actual DOM node, access it with `.current`
- Always add `useCallback` function itself in `useEffect` dependency array when using both together