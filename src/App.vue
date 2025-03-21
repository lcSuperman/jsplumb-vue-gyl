<template>
  <div id="app">
    <Flow/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Flow from './flow.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Flow
  }
}
</script>

<style>
#app{
  height: 100%;
  width:100%;
}
</style>
