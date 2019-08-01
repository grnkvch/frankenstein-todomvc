import React, { Component } from 'react'
import TodoTextInput from './TodoTextInput'

import todoStorage from "../storage"

import 'todomvc-app-css/index.css'
import styles from './Header.module.css'

class Header extends Component {
  constructor(props) {
    super(props);
    this.documentRoot = this.props.root? this.props.root: document;
    this.state = {
      todos: todoStorage.fetch()
    };
  }

  componentDidMount() {
    document.addEventListener("store-update", this.updateTodos);
  }

  componentWillUnmount() {
    document.removeEventListener("store-update", this.updateTodos);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.todos !== this.state.todos) {
      todoStorage.save(this.state.todos);
    }
  }

  updateTodos = e => {
    this.setState({ todos: e.detail.todos });
  }

  addTodo = text => {
    const todos = [
      {
        id: todoStorage.generateid(5),
        completed: false,
        text: text
      },
      ...this.state.todos
    ];
    this.setState({ todos });
  }

  handleSave = text => {
    if (text.length !== 0) {
      this.addTodo(text)
    }
  }

  render() {
    return (
      <header>
        <h1 className={styles.todoHeader}>React.todos</h1>
        <TodoTextInput
          className={styles.todoInput}
          newTodo
          onSave={this.handleSave}
          placeholder="What needs to be done?"
            />
      </header>
    );
  }
}

export default Header
