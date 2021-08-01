<template>
  <div></div>
</template>
<script>
import <%= options.componentName %> from './<%= options.componentName %>.module.js'
export default {
 name:  <%= options.componentName %>,
 mixins: [<%= options.componentName %>]
}
</script>
<style lang="scss">
@import "<%= options.componentName %>.style";
</style>
