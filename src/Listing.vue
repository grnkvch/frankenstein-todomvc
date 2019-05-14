<template>
  <section class="main" v-show="todos.length">
    <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list" ref="root">
      <li class="todo" v-for="todo in filteredTodos" :key="todo.id" :class="{completed: todo.completed, editing: todo === editedTodo}">
        <div class="view">
          <input class="toggle" type="checkbox" v-model="todo.completed">
          <label @dblclick="editTodo(todo)">{{todo.text}}</label>
          <button class="destroy" @click="removeTodo(todo)"></button>
        </div>
        <input class="edit" type="text" v-model="todo.text" v-todo-focus="todo === editedTodo" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)">
      </li>
    </ul>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong v-text="remaining"></strong> {{pluralize('item', remaining)}} left
      </span>
      <ul class="filters">
        <li><a href="#/all" @click="updateVisibility('all')" :class="{selected: visibility === 'all'}">All</a></li>
        <li><a href="#/active" @click="updateVisibility('active')" :class="{selected: visibility === 'active'}">Active</a></li>
        <li><a href="#/completed" @click="updateVisibility('completed')" :class="{selected: visibility === 'completed'}">Completed</a></li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
  import Vue from "vue";
  import todoStorage from "./storage";

  const filters = {
    all: function (todos) {
      return todos;
    },
    active: function (todos) {
      return todos.filter(function (todo) {
        return !todo.completed;
      });
    },
    completed: function (todos) {
      return todos.filter(function (todo) {
        return todo.completed;
      });
    }
  };

  export default {
    name: 'todoapp-listing',

    // app initial state
    data: () => {
      return {
        todos: todoStorage.fetch(),
        newTodo: '',
        editedTodo: null,
        visibility: 'all'
      }
    },

    // watch todos change for localStorage persistence
    watch: {
      todos: {
        handler: todoStorage.save,
        deep: true,
      }
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
      filteredTodos: function () {
        return filters[this.visibility](this.todos);
      },
      remaining: function () {
        return filters.active(this.todos).length;
      },
      allDone: {
        get: function () {
          return this.remaining === 0;
        },
        set: function (value) {
          this.todos.forEach(function (todo) {
            todo.completed = value;
          });
        }
      }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {

      updateVisibility: function(type) {
        this.visibility = type;
      },

      pluralize: function (word, count) {
        return word + (count === 1 ? '' : 's');
      },
      
      removeTodo: function (todo) {
        var index = this.todos.indexOf(todo);
        this.todos.splice(index, 1);
      },

      editTodo: function (todo) {
        this.beforeEditCache = todo.text;
        this.editedTodo = todo;
      },

      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return;
        }
        this.editedTodo = null;
        todo.text = todo.text.trim();
        if (!todo.text) {
          this.removeTodo(todo);
        }
      },

      cancelEdit: function (todo) {
        this.editedTodo = null;
        todo.text = this.beforeEditCache;
      },

      removeCompleted: function () {
        this.todos = filters.active(this.todos);
      },

      updateTodos: function(e) {
        if(this.todos !== e.detail.todos) {
          this.todos = e.detail.todos;
        }
        Vue.nextTick(() => {
          const root = this.$refs.root
          root.classList.add('rubberBand');
          setTimeout(() => {
            root.classList.remove('rubberBand');
          }, 1000);
        }, this);
      }
    },

    created: function() {
      document.addEventListener('store-update', this.updateTodos);
    },

    destroyed: function() {
      document.removeEventListener('store-update', this.updateTodos);
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
      "todo-focus": function(el, binding) {
        if (binding.value) {
          el.focus();
        }
      }
    }
  }

</script>
<style>
  @import "./listing-styles.css";
</style>