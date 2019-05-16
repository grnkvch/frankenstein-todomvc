import React, {Component} from 'react'
import TodoItem from './TodoItem'
import Footer from './Footer'
import $ from "jquery";
import _ from 'lodash';
import "bootstrap";

import "../styles.css"

import todoStorage from "../storage";

const TODO_FILTERS = {
  SHOW_ALL: () => true,
  SHOW_ACTIVE: todo => !todo.completed,
  SHOW_COMPLETED: todo => todo.completed
}

class MainSection extends Component {
  constructor(props) {
    super(props);
    this.documentRoot = this.props.root? this.props.root: document;
    this.state = {
      todos: todoStorage.fetch(),
      filter: 'SHOW_ALL'
    };
  }

  componentDidMount() {
    document.addEventListener("store-update", this.updateTodos);
    $('[data-toggle="tooltip"]', this.documentRoot).tooltip({
      container: this.props.root || 'body'
    });
  }

  componentWillUnmount() {
    document.removeEventListener("store-update", this.updateTodos);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.todos.length !== this.state.todos.length) {
      $('.main', this.documentRoot).addClass('rubberBand');
      _.delay(() => {
        $('.main', this.documentRoot).removeClass('rubberBand');
        $('[data-toggle="tooltip"]', this.documentRoot).tooltip({
          container: this.props.root || 'body'
        });
      }, 1000);
    }
    if (prevState.todos !== this.state.todos) {
      todoStorage.save(this.state.todos);
    }
  }

  updateTodos = e => {
    this.setState({ todos: e.detail.todos });
  }

  deleteTodo = (e, id) => {
    $(e.target, this.documentRoot).tooltip('dispose')
    $('.main', this.documentRoot).addClass('jello')
    const todos = this.state.todos.filter(todo => todo.id !== id)
    this.setState({todos})
    _.delay(() => {
      $('.main', this.documentRoot).removeClass('jello');
    }, 1000)
  }

  editTodo = (id, text) => {
    const todos = this.state.todos.map(todo =>
      todo.id === id ? {...todo, text} : todo
    )
    this.setState({todos})
  }

  completeTodo = (id) => {
    const todos = this.state.todos.map(todo =>
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    )
    this.setState({todos})
  }

  completeAll = () => {
    const areAllMarked = this.state.todos.every(todo => todo.completed)
    const todos = this.state.todos.map(todo => {
      return {...todo, completed: !areAllMarked}
    })
    this.setState({todos})
  }

  clearCompleted = () => {
    const todos = this.state.todos.filter(todo => todo.completed === false)
    this.setState({todos})
  }

  actions = {
    addTodo: this.addTodo,
    deleteTodo: this.deleteTodo,
    editTodo: this.editTodo,
    completeTodo: this.completeTodo,
    completeAll: this.completeAll,
    clearCompleted: this.clearCompleted
  }
  handleClearCompleted = () => {
    this.actions.clearCompleted()
  }

  handleShow = filter => {
    this.setState({ filter })
  }

  renderToggleAll(completedCount) {
    if (this.state.todos.length > 0) {
      return (
        <input
          className="toggle-all"
          type="checkbox"
          checked={completedCount === this.state.todos.length}
          onChange={this.actions.completeAll}
        />
      )
    }
  }

  renderFooter(completedCount) {
    const activeCount = this.state.todos.length - completedCount

    if (this.state.todos.length) {
      return (
        <Footer
          completedCount={completedCount}
          activeCount={activeCount}
          filter={this.state.filter}
          onClearCompleted={this.handleClearCompleted.bind(this)}
          onShow={this.handleShow.bind(this)} />
      )
    }
  }

  render() {
    const filteredTodos = this.state.todos.filter(TODO_FILTERS[this.state.filter])
    const completedCount = this.state.todos.reduce((count, todo) => {
      return todo.completed ? count + 1 : count
    }, 0)

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...this.actions} />
          )}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    )
  }
}

export default MainSection