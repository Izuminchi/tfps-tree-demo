<template>
  <div>
    <ul id="demo">
      <tree-item
        class="item"
        :item="treeData"
        @make-folder="makeFolder"
        @add-item="addItem"
      ></tree-item>
    </ul>
  </div>
  
</template>

<script>
import treeItem from './TreeItem.vue'

var treeData = {
  name: 'My Tree',
  children: [
    { name: 'hello' },
    { name: 'wat' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        },
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            { name: 'hello' },
            { name: 'wat' }
          ]
        }
      ]
    }
  ]
}

export default {
  name: 'demo',
  components: {treeItem},
  data: () => {
    return {
      treeData: treeData
    }
  },
  methods: {
    makeFolder: function (item) {
      this.$set(item, 'children', [])
      this.addItem(item)
    },
    addItem: function (item) {
      item.children.push({
        name: 'new stuff'
      })
    }
  }
}
</script>

