<template>
  <header class="header">
    <h1 :class="$style.TodoHeader">Vue.todos</h1>
    <input
      class="new-todo"
      :class="$style.NewTodo"
      autofocus
      autocomplete="off"
      placeholder="What needs to be done?"
      v-model="newTodo"
      @keyup.enter="addTodo"
    />
  </header>
</template>

<script>
import todoStorage from "./storage";

export default {
  name: "todoapp-header",
  
  // app initial state
  data: () => {
    return {
      todos: todoStorage.fetch(),
      newTodo: "",
      editedTodo: null,
      visibility: "all"
    };
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.unshift({
        id: todoStorage.generateid(5),
        text: value,
        completed: false
      });
      this.newTodo = "";
      todoStorage.save(this.todos);
    },

    updateTodos: function(e) {
      if (this.todos !== e.detail.todos) {
        this.todos = e.detail.todos;
      }
    }
  },

  created: function() {
    document.addEventListener("store-update", this.updateTodos);
  },

  destroyed: function() {
    document.removeEventListener("store-update", this.updateTodos);
  }
};
</script>
<style module>
.TodoHeader {
  text-indent: 100%;
  overflow-x: hidden;
  background-image: url(../public/logo.png) !important;
  height: 100px;
  background-size: auto 100px;
  background-position: center center;
  background-repeat: no-repeat;
  top: -200px !important;
}
.NewTodo::placeholder {
  color: #41b883 !important;
}
</style>
