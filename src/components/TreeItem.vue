<template>
  <li>
    <div
      :class="{bold: isFolder}"
      @click="toggle"
      @dblclick="makeFolder">
      {{ item.name }}
      <span>[ {{ isOpen ? '-' : '+' }} ]</span>
    </div>
    <ul v-show="isOpen">
      <li class="add" @click="$emit('add-item', item)">+</li>
      <tree-item
        class="item"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)">
      </tree-item>
      
    </ul>
  </li>
</template>

<script>
export default {
  name: 'tree-item',
  props: {
    item: Object
  },
  data: () => {
    return {
      isOpen: true
    }
  },
  computed: {
    isFolder: function () {
      return this.item.children &&
        this.item.children.length
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    makeFolder: function () {
      if (!this.isFolder) {
      	this.$emit('make-folder', this.item)
        this.isOpen = true
      }
    }
  }
}
</script>