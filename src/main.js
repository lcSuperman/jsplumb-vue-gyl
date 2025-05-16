import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design'
import VueClipboard from 'vue-clipboard2'

import clickOutside from '@/assets/directives/clickOutside.js';
import 'view-design/dist/styles/iview.css'
import '@/assets/css/base-css.css'



Vue.config.productionTip = false

Vue.use(ViewUI);
Vue.use(VueClipboard)

Vue.directive('clickOutside', clickOutside);

new Vue({
  render: h => h(App),
}).$mount('#app')
