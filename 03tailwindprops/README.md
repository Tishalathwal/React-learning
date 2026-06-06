
## Tailwind CSS

### What is Tailwind?

Tailwind CSS is a **utility-first CSS framework**. Instead of writing a separate CSS file, you use pre-built classes directly in your HTML/JSX.

### Common Tailwind Classes

| Class | What it does |
|-------|--------------|
| `bg-red-500` | Background color |
| `text-white` | White font color |
| `p-4` | Padding |
| `m-2` | Margin |
| `flex` | Display flex |
| `items-center` | Align items center |
| `gap-4` | Gap between flex items |
| `rounded-xl` | Border radius |
| `hover:bg-blue-700` | Hover state |

### Tailwind Setup in React

## Tailwind CSS Installation (with Vite)

### Step 1 — Create your Vite project

```bash
npm create vite@latest my-project
cd my-project
```

### Step 2 — Install Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 3 — Configure the Vite plugin

In `vite.config.ts` (or `vite.config.js`):

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

### Step 4 — Import Tailwind CSS

In your main CSS file (e.g. `src/index.css`):

```css
@import "tailwindcss";
```

### Step 5 — Start your dev server

```bash
npm run dev
```

### Step 6 — Start using Tailwind classes

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

> **Note:** This is Tailwind v4 setup. It uses `@tailwindcss/vite` plugin — no `tailwind.config.js` needed anymore.


> **Note:** In JSX, use `className` instead of `class`.

---

## Props

### What are Props?

Props stand for **properties**. They are the way to pass data from a parent component to a child component.

- Props are **read-only** — the child cannot modify them
- Data flows **one-way** — only parent → child
- Props work just like **function arguments**

### Basic Example

**Parent component (sends data):**

```jsx
<Card username="Tisha" age={21} isAdmin={true} />
```

**Child component (receives props):**

```jsx
function Card(props) {
  return (
    <div>
      <h2>{props.username}</h2>
      <p>Age: {props.age}</p>
    </div>
  )
}
```

### Destructuring (Cleaner Way)

```jsx
function Card({ username, age, isAdmin }) {
  return (
    <div>
      <h2>{username}</h2>
      <p>Age: {age}</p>
      {isAdmin && <span>Admin</span>}
    </div>
  )
}
```

### Reusability with Props

```jsx
<Card username="Tisha" age={21} />
<Card username="Deepak" age={22} />
<Card username="Priya" age={20} />
```

Same component, different data — that's the real power of props.

### Props + Tailwind Combo

```jsx
function Button({ label, color }) {
  return (
    <button className={`bg-${color}-500 text-white p-2 rounded`}>
      {label}
    </button>
  )
}

<Button label="Submit" color="blue" />
<Button label="Cancel" color="red" />
```

---

## Key Points

- In JSX use `className`, not `class`
- Props = parent to child only (one-way)
- Props are read-only — use State if you need to change data
- Always destructure props — keeps code clean
- Tailwind only includes used classes in production build → very small file size