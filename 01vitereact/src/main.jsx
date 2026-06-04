import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/*

**********This is how i made this but react doesn't work like this

const ReactElement = {
    type: 'a',
    props: {
        href: 'https://google.com',
        target: '_blank'
    },
    children: 'Click me to visit google'
}
*/

// ********way of add tag**********
const anotherElement = (
    <a href="https://google.com" target='_blank'>Visit google</a>
)


const fromReact = React.createElement(
  'a',
  {href: 'https://google.com', target: '_blank'},
  'click me'
)


ReactDOM.createRoot(document.getElementById('root')).render(
  fromReact
)
