<template>
  <div>
    <div>
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
          <div v-if="itemType === 'st'">
            <b-form-group id="input-group-2" label="端末台数" label-for="input-2">
              <b-form-input id="input-2" v-model="itemNum"></b-form-input>
            </b-form-group>
          </div>
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
      itemNum: '',
      itemType: '',
      item: Object,
      modalTitle: '事業者登録'
    }
  },
  methods: {
    addItem: function (item) {
      if (item.children == undefined) {
        this.$set(item, 'children', [])
      }
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
          return
        default:
      }
      this.item = item
      this.showModal = true
    },
    add: function () {
      if (this.itemType === "op") {
        this.treeData.push({name: this.itemName, type: this.itemType})
      } else if (this.itemType === "st") {
        this.item.children.push({
          name: this.itemName,
          type: this.itemType,
          children: [{
            name: this.itemNum,
            type: "tm"
            }]
        })

      } else {
        this.item.children.push({
          name: this.itemName,
          type: this.itemType
        })

      }
      this.clearItemName()
    },
    clearItemName: function () {
      this.itemName = ''
      this.itemNum = ''
    }
  }
}
</script>
