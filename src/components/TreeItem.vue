<template>
  <li class="tree-col">
    <i v-show="isFolder" @click="toggle" class="fas fa-fw" :class="caretClass" aria-hidden="true"></i>
    <div :class="{bold: isFolder, 'ml-125': !isFolder}" class="col-width" @mouseover="isHover=true" @mouseout="isHover=false">
      
      <i v-show="item.type=='enterprise'" class="far fa-building fa-fw"></i>
      <i v-show="item.type=='merchant'" class="fas fa-store-alt fa-fw"></i>
      <i v-show="item.type=='store'" class="fas fa-tablet-alt fa-fw"></i>

      <div v-if="item.id" class="d-inline">
        <span v-if="!editableId" class="id" @click="editableId=true, setEditable()">{{ item.id }} </span>
        <input v-else type="number" class="id" min="1" size="8" :value="item.id" ref="ref" @input="updateId" @blur="editableId=false" @keyup.enter="editableId=false">
      </div>
      
      <div v-if="item.name" class="d-inline">
        <span v-if="!editableName" class="name" @click="editableName=true, setEditable()">{{item.name | truncate(10)}}</span>
        <input v-else type="text" class="name" :value="item.name" ref="ref" @input="updateName" @blur="editableName=false" @keyup.enter="editableName=false">
      </div>
      
      <div v-if="item.terminals!=undefined" class="d-inline">
        <span>：</span>
        <span v-if="!editableTerminal" class="terminal" @click="editableTerminal=true, setEditable()">{{item.terminals!=null?item.terminals:0}}台</span>
        <input v-else type="number" class="terminal" min="1" size="3" :value="item.terminals" ref="ref" @input="updateTerminals" @blur="editableTerminal=false" @keyup.enter="editableTerminal=false">
      </div>
      
      <span v-show="isHover">
        <i class="far fa-edit fa-fw" @click="editItem(item)"></i>
      </span>
      <span v-show="isHover">
        <i class="far fa-trash-alt fa-fw" @click="deleteItem(item)"></i>
      </span>
      
      <b-button id="add-child" v-if="showAdd" variant="outline-secondary" class="d-block mb-2" size="sm" @click="$emit('add-button-clicked', item)">{{addName}}を追加する</b-button>
    </div>
    <ul v-show="isOpen">
      <tree-item
        class="item"
        v-for="(merchant, index) in children"
        :key="index"
        :item="merchant"
        @click="toggle"
        @add-button-clicked="$emit('add-button-clicked', $event)"
        @delete-button-clicked="$emit('delete-button-clicked', $event)"
        @edit-button-clicked="$emit('edit-button-clicked', $event)"
        @update-id="$emit('update-id', $event)"
        @update-name="$emit('update-name', $event)"
        @update-terminals="$emit('update-terminals', $event)">
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
      isOpen: true,
      isHover: false,
      editableId: false,
      editableName: false,
      editableTerminal: false,
    }
  },
  computed: {
    isFolder: function () {
      return this.children &&
        this.children.length
    },
    showAdd: function () {
      return this.item.type != 'store'
    },
    children: function () {
      return this.item.merchants || this.item.stores
    },
    caretClass () {
      return this.isOpen ? 'fa-caret-down' : 'fa-caret-right'
    },
    addName () {
      return this.item.type == "enterprise" ? "加盟店" : "設置店舗"
    }
  },
  filters: {
    truncate: function (text, length) {
      if (text.length <= length) {
        return text;
      } else {
        return text.substring(0, length) + '...';
      }
    } 
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    setEditable () {
      this.$nextTick(() => this.$refs.ref.focus())
    },
    updateId (e) {
      this.$emit('update-id', {value: e.target.value, item:this.item})
    },
    updateName (e) {
      this.$emit('update-name', {value: e.target.value, item:this.item, parent: this.$parent})
    },
    updateTerminals (e) {
      this.$emit('update-terminals', {value: e.target.value, item:this.item})
    },
    editItem () {
      this.$emit('edit-button-clicked', {parent: this.$parent, item:this.item})
    },
    deleteItem () {
      this.$emit('delete-button-clicked', {parent: this.$parent, child: this.item})
    }
  }
}
</script>

<style>
.tree-col {
  display: flex;
  padding: 0;
  margin-right: -15px;
  margin-left: -15px;
}
ul{
  padding-left: 0;
}
.col-width{
  width: 350px;
}
.caretClass {
  margin-left: -1rem;
}
.ml-125 {
  margin-left: 1.25rem;
}
</style>