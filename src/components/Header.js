import React, { Component } from 'react'
import TodoTextInput from './TodoTextInput'

import todoStorage from "../storage"

import 'todomvc-app-css/index.css'
import styled from 'styled-components'

const StyledTitle = styled.h1`
  text-indent: 100%;
  overflow-x: hidden;
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg');
  height: 100px;
  background-size: auto 100px;
  background-position: center center;
  background-repeat: no-repeat;
  top: -180px !important;
`
const StyledInputWrapper = styled.div`
  input::placeholder {
    color: #00d8ff;
  }
`
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
        <StyledTitle>React.todos</StyledTitle>
        <StyledInputWrapper>
          <TodoTextInput
            newTodo
            onSave={this.handleSave}
            placeholder="What needs to be done?"
              />
        </StyledInputWrapper>
      </header>
    );
  }
}

export default Header
