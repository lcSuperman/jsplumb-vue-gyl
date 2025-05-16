<template>
  <div id="app">
    <Sichuang/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Sichuang from './views/sichuan'
import Flow from './flow.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Flow,
    Sichuang
  }
}
</script>

<style>
#app{
  height: 100%;
  width:100%;
  background-color: rgb(230, 230, 230);
}
</style>
