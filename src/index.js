import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
import 'todomvc-app-css/index.css'
import { SHOW_ALL } from './constants/TodoFilters'

const currentState = {
  todos: JSON.parse(localStorage.getItem('frankenstein') || "[]"),
  visibilityFilter: SHOW_ALL
}
const store = createStore(reducer, currentState)

function select(state) {
  return state.todos
}

let currentTodos
function handleChange() {
  let previousTodos = currentTodos
  currentTodos = select(store.getState())

  if (previousTodos !== currentTodos) {
    localStorage.setItem('frankenstein', JSON.stringify(currentTodos));
    var event = new CustomEvent("store-update", { detail: { currentTodos } });
    document.dispatchEvent(event);
  }
}

store.subscribe(handleChange)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
