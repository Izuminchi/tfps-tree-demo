<template>
  <div>
    <div > 
      <b-button @click="showModal=true, itemType='op'">+ 事業者追加</b-button>
      <b-modal v-model="showModal">
        <template slot="modal-title">{{ modalTitle }}</template>
        <b-form-group label-for="inputname">
          <b-form-radio-group id="inputname"
            :plain="true"
            :options="[
              {text: '新規 ', value: '1'},
              {text: '既存 ', value: '2'}
              ]"
              :checked="3">
            </b-form-radio-group>
            <b-form-input v-model="itemName"></b-form-input>
         </b-form-group>
         <template slot="modal-footer" slot-scope="{ ok, cancel }">
           <b-button size="sm" @click="cancel()">Cancel</b-button>
           <b-button size="sm" variant="primary" @click="add(), showModal=false">OK</b-button>
         </template>
      </b-modal>
    </div>
    
    <ul v-for="data in treeData" id="tree">
      <tree-item
        class="item"
        :item="data"
        @make-folder="makeFolder"
        @add-item="addItem">
      </tree-item>
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
      showModal: false,
      treeData: [],
      itemName: '',
      itemType: '',
      item: Object,
      modalTitle: '事業者登録'
    }
  },
  methods: {
    makeFolder: function (item) {
      this.$set(item, 'children', [])
    },
    addItem: function (item) {
      console.log(item);
      if (item.children == undefined) {
        this.$set(item, 'children', [])
      }
      console.log(item);
      switch (item.type) {
        case "op":
          this.modalTitle = "加盟店登録"
          this.itemType = "mc"
          break;
        case "mc":
          this.modalTitle = "設置店舗登録"
          this.itemType = "st"
          break;
        case "st":
          this.modalTitle = "設置端末数登録"
          this.itemType = "tm"
          break;
        case "tm":
          return
        default:
      }
      this.item = item
      this.showModal = true
    },
    add: function () {
      console.log(this.itemType);
      if (this.itemType != "op") {
        this.item.children.push({
          name: this.itemName,
          type: this.itemType
        })
      } else {
        this.treeData.push({name: this.itemName, type: this.itemType})
      }
      this.clearItemName()
    },
    clearItemName: function () {
      this.itemName = ''
    }
  }
}
</script>

