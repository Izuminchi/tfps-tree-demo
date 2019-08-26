<template>
  
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-alert variant="success" dismissible :show="successAlert" @dismissed="successAlert=false">アップロードが完了しました</b-alert>
      <b-alert variant="danger" dismissible :show="errorAlert" @dismissed="errorAlert=false">{{errorMessage}}</b-alert>
      <b-row class="ml-3">
        <b-col>
          <b-form-group
              label="ACQコード"
              label-for="acq-code"
              :label-cols="1">
              <b-form-input id="acq-code" type="number" v-model="acqCode" style="width:150px;"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    
      <b-row class="ml-3">
        <b-col sm="4" md="3">
          <b-button block id="add-enterprise" @click="addEnterprise()">+ 事業者を追加する</b-button>
        </b-col>
        <b-col sm="4" md="3">
          <b-button block @click="sendJson()">作成</b-button>
        </b-col>
      </b-row>
      
      <ul v-for="(data, index) in item" class="tree" :key="index">
        <tree-item
          class="item"
          :item="data"
          @add-button-clicked="showAddModal"
          @delete-button-clicked="showDeleteModal"
          @edit-button-clicked="showEditModal"
          @update-id="updateId"
          @update-name="updateName"
          @update-terminals="updateTerminals">
        </tree-item>
      </ul>
    </div>
          
    <b-modal v-model="showJson" hide-footer >
      <div class="card mr-auto ml-auto">
        <div class="card-header">
          <span>json</span>
        </div>
        <div class="card-body p-2">
          {{item}}
        </div>
      </div>
    </b-modal>
      
    <b-modal id="add-modal" size="lg" v-model="addModal" @show="errors=[]">
      <template slot="modal-title">{{ modalTitle }}登録</template>
      <div class="text-center loading" v-show="loading">
        <b-spinner style="width: 4rem; height: 4rem;"></b-spinner>
      </div>
      
      <hot-table ref="hotTable" :settings="hotSettings" style="height:440px; overflow:hidden;">
        <hot-column title="ID" :settings="numSetting" :width="250"></hot-column>
        <hot-column title="名称" :width="360"></hot-column>
        <hot-column v-if="itemType==='store'" title="端末台数" :settings="numSetting" :width="100"></hot-column>
      </hot-table>
      
      <p v-show="errors.length">
        <ul class="text-danger pl-0">
          <li class="pb-0" v-for="(error,index) in errors" :key="index">{{ error }}</li>
        </ul>
      </p>
      
      <template slot="modal-footer">
        <b-button size="sm" @click="addModal=false">キャンセル</b-button>
        <b-button size="sm" id="add-button" variant="primary" @click="addButtonClicked" :disabled="loading">追加</b-button>
      </template>
    </b-modal>
      
    <b-modal id="delete-modal" size="sm" v-model="deleteModal" hide-header>
      <p class="my-4">削除してよろしいですか？</p>
      <template slot="modal-footer">
        <b-button size="sm" @click="deleteModal=false">キャンセル</b-button>
        <b-button size="sm" id="ok" variant="primary" @click="deleteTrue">OK</b-button>
      </template>
    </b-modal>
      
    <b-modal id="edit-modal" v-model="editModal" title="編集" @show="errors=[]">
      <b-form-group>
        <label for="edit-id">ID</label>
        <b-form-input id="edit-id" type="number" min="1" v-model="editInput.id"></b-form-input>
      </b-form-group>
      <b-form-group>
        <label for="edit-name">名称</label>
        <b-form-input id="edit-name" v-model="editInput.name"></b-form-input>
      </b-form-group>
      <div v-if="itemToEdit && itemToEdit.item.terminals!=null">
        <label for="edit-terminal">端末台数</label>
        <b-form-input id="edit-terminal" type="number" min="1" v-model="editInput.terminals"></b-form-input>
      </div>
      <p v-show="errors.length">
        <ul class="text-danger pl-0">
          <li class="pb-0" v-for="(error,index) in errors" :key="index">{{ error }}</li>
        </ul>
      </p>
      <template slot="modal-footer">
        <b-button size="sm" @click="editModal=false">キャンセル</b-button>
        <b-button size="sm" id="update" variant="primary" @click="editButtonClicked">保存</b-button>
      </template>
    </b-modal>
    
  </div>
</template>

<script>
import TreeItem from '@/components/TreeItem.vue'
import { HotTable, HotColumn } from '@handsontable/vue'
import hotTableSettings from '@/hotTableSettings.js'
import sampleData from '@/sample_data.js'

export default {
  name: 'register',
  components: { TreeItem, HotTable, HotColumn },
  data: () => {
    return {
      addModal: false,
      deleteModal: false,
      editModal: false,
      loading: false,
      showJson: false,
      successAlert: false,
      errorAlert: false,
      errorMessage: '',
      modalTitle: '',
      itemType: '',
      item: [],
      itemToAdd: null,
      itemToEdit: null,
      itemToDelete: null,
      editInput: {
        id: '',
        name: '',
        terminals: ''
      },
      acqCode: '',
      errors: [],
      regex: /^([1-9][0-9]*)*$/,
      hotSettings: hotTableSettings.hotSetting,
      numSetting: hotTableSettings.numSetting
    }
  },
  methods: {
    addEnterprise () {
      this.modalTitle = "事業者"
      this.itemType   = "enterprise"
      this.addModal   = true
      this.itemToAdd  = null
    },
    showAddModal (item) {
      switch (item.type) {
        case "enterprise":
          if (!item.merchants) {
            this.$set(item, 'merchants', [])
          }
          this.modalTitle = "加盟店"
          this.itemType   = "merchant"
          break;
        case "merchant":
          if (!item.stores) {
            this.$set(item, 'stores', [])
          }
          this.modalTitle = "設置店舗"
          this.itemType   = "store"
          break;
        default:
      }
      this.itemToAdd  = item
      this.addModal = true
    },
    createData (idList, nameList, terminalList, type) {
      let data  = []
      for (let i = 0; i < idList.length; i++) {
        data.push({
          id: parseInt(idList[i]), 
          name: nameList[i],
          type: type
        })
        if (this.itemType == "store") {
          data[i]["terminals"] = terminalList[i] ? parseInt(terminalList[i]) : 0
        }
      }
      return data
    },
    typeIs (type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && type.includes(clas);
    },
    addButtonClicked () {
      const col1 = this.$refs.hotTable.hotInstance.getDataAtCol(0)
      const col2 = this.$refs.hotTable.hotInstance.getDataAtCol(1)
      const col3 = this.$refs.hotTable.hotInstance.getDataAtCol(2)
      let idList       = []
      let nameList     = []
      let terminalList = []
      
      //IDか名称がある行のみリストに格納
      for (let i = 0; i < col1.length; i++) {
        if (col1[i] || col2[i]) {
          idList.push(col1[i])
          nameList.push(col2[i])
          terminalList.push(col3[i])
        }
      }
      
      //validation
      this.errors = []
      
      /* 新規のみ名称の重複チェック */
      //入力済み&入力中の中で、IDのないnodeの名称リストを取得
      let newNameList = this.getEnteredNameList(this.itemToAdd)
      idList.forEach((v, i) => { if(!v) newNameList.push(nameList[i])})
      if (new Set(newNameList).size !== newNameList.length) {
        this.errors.push("名称が重複しています")
      }
      /* idの重複チェック */
      //入力済みIDの取得
      const enteredIdList = this.getEnteredIdList(this.itemType)
      if (this.hasSameId(idList, enteredIdList)) {
        this.errors.push("IDが重複しています")
      }
      /* 入力中の端末台数の合計と入力済みの端末台数の合計が 6000台を超えないように制限 */
      if (this.itemType == "store") {
        //入力中の端末台数の合計を取得
        let inputTotal = terminalList.reduce((accumulator, currentValue) => {
          let val = currentValue ? parseInt(currentValue) : 0
          return accumulator + val
        }, 0)
        if (inputTotal + this.getTerminals() > 6000) {
          this.errors.push("一度に登録可能な端末の最大数(6000)をオーバーしています")
        }  
      }
      if (this.errors.length > 0) {
        return
      }
      
      //追加するdataを作成
      let data = this.createData(idList, nameList, terminalList, this.itemType)
      
      this.loading = true
      setTimeout(() => {
        this.addItem(data)
        this.loading  = false
        this.addModal = false
      }, 1);   
    },
    addItem (data) {
      //typeによって追加先のプロパティを切り分け
      switch (this.itemType) {
        case "enterprise":
          this.item = this.item.concat(data)
          break;
        case "merchant":
          this.itemToAdd.merchants = this.itemToAdd.merchants.concat(data)
          break;
        case "store":
          this.itemToAdd.stores = this.itemToAdd.stores.concat(data)
          break;
        default:
      }
    },
    showEditModal (data) {
      this.editModal  = true
      this.itemToEdit = data
      this.editInput = {
        id:  data.item.id,
        name: data.item.name,
        terminals: data.item.terminals
      }
    },
    editButtonClicked () {
      let item = this.itemToEdit.item
      const parent = this.itemToEdit.parent.item
      
      // 編集中のID以外のIDリストを取得
      const enteredNameList = this.getEnteredNameList(parent).filter(n=>n!==item.name)
      // 編集中のID以外のIDリストを取得
      const enteredIdList = this.getEnteredIdList(item.type).filter(n=>n!==item.id)
      // 編集中の端末台数以外の合計台数を取得
      const terminalTotal = this.getTerminals() - parseInt(item.terminals)
      this.errors = []
      
      if (!this.editInput.id && !this.editInput.name) {
        this.errors.push("IDまたは名称のどちらかを記入してください")
      }
      
      if (!this.editInput.id && this.editInput.name && enteredNameList.includes(this.editInput.name)) {
        this.errors.push("名称が重複しています")
      }
      
      if (this.editInput.id && this.hasSameId([this.editInput.id], enteredIdList)) {
        this.errors.push("IDが重複しています")
      }
      if (this.editInput.terminals && (parseInt(this.editInput.terminals) + terminalTotal) > 6000) {
        this.errors.push("一度に登録可能な端末の最大数(6000)をオーバーしています")
      }
      if (this.errors.length > 0) {
        return
      }
      item.id   = parseInt(this.editInput.id)
      item.name = this.editInput.name
      if (item.type == "store") {
        item.terminals = this.editInput.terminals ? parseInt(this.editInput.terminals) : 0
      }
      this.editModal = false
    },
    updateId (e) {
      let idList = this.getEnteredIdList(e.item.type)
      if (e.value && this.regex.test(e.value) && !this.hasSameId([e.value], idList)) {
        e.item.id = parseInt(e.value)
      }
    },
    updateName (e) {
      const enteredNameList = this.getEnteredNameList(e.parent.item).filter(n=>n!==e.item.name)
      if (!e.item.id && e.value && enteredNameList.includes(e.value) || !e.value) {
        return
      } else {
        e.item.name = e.value
      }
    },
    updateTerminals (e) {
      const value = parseInt(e.value)
      const oldValue = parseInt(e.item.terminals)
      const terminals = this.getTerminals() - oldValue
      if (!e.value) {
        e.item.terminals = 0
      } else if (this.regex.test(value) && (value + terminals) <= 6000) {
        e.item.terminals = value
      }
    },
    getEnteredNameList (item) {
      const self = this
      let nameList = []
      let targetNode
      
      if (self.typeIs(['Object'], item)) {
        // 追加対象と同じ階層のnodeを取得
        Object.entries(item).forEach(([k, v]) => {
          if (self.typeIs(['Array'], v)) { targetNode = v }
        })
      } else {
        // 事業者の場合は親node
        targetNode = this.item
      }
      // IDがないnodeの名称をリストに格納
      targetNode.forEach((value) => { if (!value.id) nameList.push(value.name) })
      return nameList
    },
    getEnteredIdList (type) {
      let idList = []
      this.item.forEach((value) => {
        if (type == "enterprise" && value.id) { idList.push(value.id) }
        if (value.merchants) {
          value.merchants.forEach((value) => {
            if (type == "merchant" && value.id) {idList.push(value.id)}
            if (value.stores) {
              value.stores.forEach((value) => {
               if (type == "store" && value.id) {idList.push(value.id)}
              })
            }
          })
        }
      })
      return idList
    },
    getTerminals () {
      let total = 0
      JSON.parse(JSON.stringify(this.item), (key, value) => {  
        if (key == "terminals") { total = total + value }
      })
      return total
    },
    hasSameId (inputIdList, enteredIdList) {
      const exceptNull = inputIdList.filter(Boolean)
      return exceptNull.some(value => enteredIdList.includes(parseInt(value))) 
             || new Set(exceptNull).size !== exceptNull.length
    },
    showDeleteModal (data) {
      this.deleteModal = true
      this.itemToDelete = data
    },
    deleteTrue() {
      this.deleteItem()
    },
    deleteItem () {
      const parent = this.itemToDelete.parent
      const child  = this.itemToDelete.child
      let parentItem
      
      switch (child.type) {
        case "enterprise":
          parentItem = parent.item
          break;
        case "merchant":
          parentItem = parent.item.merchants
          break;
        case "store":
          parentItem = parent.item.stores
          break;
        default:
      }
      for (let i = 0; i < parentItem.length;  i++) {
        if (parentItem[i] === child) {
          parentItem.splice(i, 1)
          break
        }
      }
      this.deleteModal = false
    },
    deleteType (item) {
      const self = this
      for (var key in item) {
        delete item.type
        if (self.typeIs(['Array', 'Object'], item[key])) {
          self.deleteType(item[key])
        }
      }
      return item
    },
    sendJson () {
      if (!this.acqCode || this.item.length == 0) {
        this.errorAlert = true
        this.errorMessage = "acqコード・データの両方を入力してください"
        return
      }
      const url = "https://1o2h0lz7dd.execute-api.ap-northeast-1.amazonaws.com/Prod/skeleton-maker"
      
      const params = new FormData();
      this.item.forEach(value => this.deleteType(value))
      const jsonData = JSON.stringify(this.item)

      params.append('file', jsonData);
      params.append('acq', this.acqCode);
      // console.log(params.get('file'));
    
      this.$axios.post(url, params, { headers: {'Content-Type': 'multipart/form-data'}})
      .then(response => {
        this.successAlert = true
      })
      .catch(error => {
        this.errorAlert = true
        this.errorMessage = "アップロードに失敗しました"
      })
      .finally(() => {
        this.acqCode = null
        this.item = []
      })
      
      this.showJson = true
    }
  }
}
</script>

<style>
.tree {
  background: #dadada;
  border-radius :8px;
  box-shadow :0px 0px 5px silver;
  padding: 0.5em 0.5em 0.5em 2em;
  margin: 30px 30px 0 30px;
  margin-top: 20px;
}
.loading{
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 40%;
}
.handsontable td {
  padding: 2px 10px 2px 10px;
  font-size: 16px;
  text-align: right;
}

</style>
