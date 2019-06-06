<template>
  <div>
    <div > 
      <b-button @click="show=true">+ 事業者追加</b-button>
      <b-modal v-model="show" id="opModal" title="事業者追加">
        <b-form-group label-for="inputname">
          <b-form-radio-group id="inputname"
            :plain="true"
            :options="[
              {text: '新規 ',value: '1'},
              {text: '既存 ',value: '2'}
              ]"
              :checked="3">
            </b-form-radio-group>
            <b-form-input v-model="opName"></b-form-input>
         </b-form-group>
         <template slot="modal-footer" slot-scope="{ ok, cancel }">
           <b-button size="sm" @click="cancel()">Cancel</b-button>
           <b-button size="sm" variant="primary" @click="add(), show=false">OK</b-button>
         </template>
      </b-modal>
    </div>

    <ul v-for="data in treeData" id="tree">
      <tree-item
        class="item"
        :item="data"
        @make-folder="makeFolder"
        @add-item="addItem"
      ></tree-item>
    </ul>
  </div>
</template>

<script>
import treeItem from './TreeItem.vue'

export default {
  name: 'tree',
  components: {treeItem},
  data: () => {
    return {
      show: false,
      treeData: [],
      opName: ''
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
    },
    add: function (){
      this.treeData.push({name: this.opName})
    } 
  }
}
</script>

