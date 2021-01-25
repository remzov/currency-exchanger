import Vue from 'vue';
import App from './App.vue';
import store from './store';
import '@/assets/styles/main.scss';
import 'normalize.css'
import vSelect from 'vue-select'

const VueInputMask = require('vue-inputmask').default

Vue.config.productionTip = false;

Vue.component('v-select', vSelect)
Vue.use(VueInputMask)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
