# 07 React Router - Notes

## Project Overview
A multi-page app built with React Router DOM including Header, Footer, Home, About, Contact, and Github pages. GitHub API integration done using `loader`.

---

## New Concepts

### 1. Installation
```bash
npm install react-router-dom
```

---

### 2. `createBrowserRouter` + `createRoutesFromElements`
Modern way to define routes.

```jsx
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />
      <Route path='github' element={<Github />} loader={githubInfoLoader} />
    </Route>
  )
)
```

---

### 3. `RouterProvider`
Injects the router into the app.

```jsx
<RouterProvider router={router} />
```

---

### 4. `Layout.jsx` + `<Outlet />`
Place shared UI (Header/Footer) in one place. Child routes render at the `<Outlet />` position.

```jsx
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <Header />
      <Outlet />   {/* child page renders here */}
      <Footer />
    </>
  )
}
```

---

### 5. `<Link>` vs `<NavLink>`
| | `<Link>` | `<NavLink>` |
|---|---|---|
| Page reload | ❌ No | ❌ No |
| Active class | ❌ No | ✅ Yes |
| Use case | General navigation | Navbar links |

```jsx
<NavLink
  to="/about"
  className={({ isActive }) =>
    isActive ? "text-orange-700" : "text-gray-700"
  }
>
  About
</NavLink>
```

---

### 6. Dynamic Routes + `useParams`
```jsx
// main.jsx
<Route path='user/:userid' element={<User />} />

// User.jsx
import { useParams } from 'react-router-dom'

const { userid } = useParams()
```

---

### 7. `loader` + `useLoaderData` (GitHub API)
Fetch data before the route renders — no need for `useEffect`.

```jsx
// Github.jsx
import { useLoaderData } from 'react-router-dom'

function Github() {
  const data = useLoaderData()

  return (
    <div>
      <p>Followers: {data.followers}</p>
      <img src={data.avatar_url} alt="avatar" width={300} />
    </div>
  )
}

// Loader function - attached to the route
export const githubInfoLoader = async () => {
  const response = await fetch('https://api.github.com/users/Tishalathwal')
  return response.json()
}

// main.jsx
<Route path='github' element={<Github />} loader={githubInfoLoader} />
```

**Benefit:** Data is ready before the page renders, no need to handle loading state manually.

---

## Folder Structure
```
src/
├── components/
│   ├── Header/Header.jsx
│   ├── Footer/Footer.jsx
│   ├── Home/Home.jsx
│   ├── About/About.jsx
│   ├── Contact/Contact.jsx
│   ├── Github/Github.jsx
│   └── User/User.jsx
├── Layout.jsx
├── main.jsx
└── App.jsx
```

---

## Common Errors & Fixes
| Error | Cause | Fix |
|---|---|---|
| `react-router-dom` not found | Package not installed | `npm install react-router-dom` |
| Page not rendering | `<Outlet />` missing | Add `<Outlet />` in `Layout.jsx` |
| Image not loading | External URL broken | Use local assets or `picsum.photos/seed/name/w/h` |
| Navbar links not visible | Tailwind `hidden` class | Maximize browser window (lg breakpoint) |

