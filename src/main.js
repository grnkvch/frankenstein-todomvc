import Vue from 'vue';
import TodoApp from './TodoApp.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(TodoApp),
}).$mount('#app');
