<template>
  <div>
    <div > 
      <b-button @click="show_operator=true">+ 事業者追加</b-button>
      <b-modal v-model="show_operator" title="事業者追加">
        <b-form-group label-for="inputname">
          <b-form-radio-group id="inputname"
            :plain="true"
            :options="[
              {text: '新規 ',value: '1'},
              {text: '既存 ',value: '2'}
              ]"
              :checked="3">
            </b-form-radio-group>
            <b-form-input v-model="itemName"></b-form-input>
         </b-form-group>
         <template slot="modal-footer" slot-scope="{ ok, cancel }">
           <b-button size="sm" @click="cancel()">Cancel</b-button>
           <b-button size="sm" variant="primary" @click="operatorAdd(), show_operator=false">OK</b-button>
         </template>
      </b-modal>
      
      <b-modal v-model="show_merchant" title="加盟店追加">
        <b-form-group label-for="inputname">
          <b-form-radio-group id="inputname"
            :plain="true"
            :options="[
              {text: '新規 ',value: '1'},
              {text: '既存 ',value: '2'}
              ]"
              :checked="3">
            </b-form-radio-group>
            <b-form-input v-model="itemName"></b-form-input>
         </b-form-group>
         <template slot="modal-footer" slot-scope="{ ok, cancel }">
           <b-button size="sm" @click="cancel()">Cancel</b-button>
           <b-button size="sm" variant="primary" @click="merchantAdd(), show_merchant=false">OK</b-button>
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
      show_operator: false,
      show_merchant: false,
      treeData: [],
      itemName: '',
      item: Object
    }
  },
  methods: {
    makeFolder: function (item) {
      this.$set(item, 'children', [])
      this.addItem(item)
    },
    addItem: function (item) {
      this.item = item
      this.show_merchant = true
    },
    operatorAdd: function () {
      this.treeData.push({name: this.itemName})
    },
    merchantAdd: function (){
      this.item.children.push({
        name: this.itemName
      })
    }
  }
}
</script>

