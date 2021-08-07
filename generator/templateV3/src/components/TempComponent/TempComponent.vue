<template>
  <div></div>
</template>
<script>
import { defineComponent } from 'vue';
import <%= options.componentName %> from './<%= options.componentName %>.module.js'
export default defineComponent({
 name:  '<%= options.componentName %>',
 setup(props, context){}
})
</script>
<style lang="scss">
@import "<%= options.componentName %>.style";
</style>
