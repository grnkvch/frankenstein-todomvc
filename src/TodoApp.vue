<template>
  <div id="app">
    <section class="todoapp">
      <todo-header></todo-header>
      <todo-listing></todo-listing>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Written by <a href="http://evanyou.me">Evan You</a></p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  </div>

</template>

<script>
  import TodoHeader from './Header';
  import TodoListing from './Listing';
  
  import "todomvc-common/base.css";
  import "todomvc-app-css/index.css";
  // import "./styles.css";

  export default {
    name: 'todoapp',
    
    components: {
      TodoHeader,
      TodoListing
    },
  }

</script>
