<template>
  <div>
    <div>
      
      <b-row class="ml-3">
        <b-col sm="4" md="2">
          <b-button block @click="addOperator()">+ 事業者を追加する</b-button>
        </b-col>
        <b-col sm="4" md="2">
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
      
      <b-modal v-model="showJson" hide-footer @hidden="$router.go({name:'register'})">
        <div class="card mr-auto ml-auto">
          <div class="card-header">
            <span>json</span>
          </div>
          <div class="card-body p-2">
            {{jsonToSend}}
          </div>
        </div>
      </b-modal>
      
      <b-modal size="xl" v-model="showModal" @show="resetModal">
        <template slot="modal-title">{{ modalTitle }}</template>
        
        <div class="text-center loading" v-show="loading">
          <b-spinner style="width: 4rem; height: 4rem;" label="Text Centered"></b-spinner>
        </div>
        
        <b-form-radio-group
          :plain="true"
          :options="[
            {text: '新規 ', value: true},
            {text: '既存 ', value: false}
            ]"
          :checked="1"
          v-model="isNew">
        </b-form-radio-group>
          
        <b-row>
          <b-col md="4">
            <b-form-group label="ID" label-for="id">
              <b-form-textarea id="id" v-model="input.id" v-bind:disabled="isNew" rows="20"></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="名称" label-for="name">
              <b-form-textarea id="name" v-model="input.name" rows="20"></b-form-textarea>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <div v-show="itemType === 'store'">
              <b-form-group label="端末台数" label-for="terminal">
                <b-form-textarea id="terminal" v-model="input.terminal" rows="20"></b-form-textarea>
              </b-form-group>
            </div>
          </b-col>
        </b-row>
        
        <p v-show="errors.length">
          <ul class="text-danger pl-0">
            <li class="pb-0" v-for="(error,index) in errors" :key="index">{{ error }}</li>
          </ul>
        </p>
        
        <template slot="modal-footer">
          <b-button size="sm" @click="showModal=false">キャンセル</b-button>
          <b-button size="sm" variant="primary" @click="addButtonClicked" :disabled="loading">追加</b-button>
        </template>
      </b-modal>
      
      <b-modal size="sm" v-model="deleteModal" hide-header @ok="deleteTrue">
        <p class="my-4">削除してよろしいですか？</p>
      </b-modal>
      
      <b-modal v-model="editModal" title="編集" @show="errors=[]">
        <b-form-group>
          <label for="edit-id">ID</label>
          <b-form-input id="edit-id" type="number" v-model="editInput.id"></b-form-input>
        </b-form-group>
        <b-form-group>
          <label for="edit-name">名称</label>
          <b-form-input id="edit-name" v-model="editInput.name"></b-form-input>
        </b-form-group>
        <div v-if="editData.terminals!=null">
          <label for="edit-terminal">端末台数</label>
          <b-form-input id="edit-terminal" type="number" v-model="editInput.terminals"></b-form-input>
        </div>
        <p v-show="errors.length">
          <ul class="text-danger pl-0">
            <li class="pb-0" v-for="(error,index) in errors" :key="index">{{ error }}</li>
          </ul>
        </p>
        <template slot="modal-footer">
          <b-button size="sm" @click="editModal=false">キャンセル</b-button>
          <b-button size="sm" variant="primary" @click="editButtonClicked">保存</b-button>
        </template>
      </b-modal>
      
    </div>
  </div>
</template>

<script>
import treeItem from '@/components/TreeItem.vue'
import sampleData from '@/sample_data.js'

export default {
  name: 'register',
  components: {treeItem},
  data: () => {
    return {
      showModal: false,
      deleteModal: false,
      editModal: false,
      isNew: true,
      loading: false,
      showJson: false,
      modalTitle: '',
      itemType: '',
      input: {
        id: '',
        name: '',
        terminal: ''
      },
      item: sampleData,
      tempItem: Object,
      errors: [],
      editData: Object,
      editInput: {
        id: '',
        name: '',
        terminals: ''
      },
      deleteData: [],
      jsonToSend: []
    }
  },
  methods: {
    addOperator () {
      this.modalTitle = "事業者登録"
      this.itemType   = 'enterprise'
      this.showModal  = true
    },
    showAddModal (item) {
      switch (item.type) {
        case "enterprise":
          if (!item.merchants) {
            this.$set(item, 'merchants', [])
          }
          this.modalTitle = "加盟店登録"
          this.itemType   = "merchant"
          break;
        case "merchant":
          if (!item.stores) {
            this.$set(item, 'stores', [])
          }
          this.modalTitle = "設置店舗登録"
          this.itemType   = "store"
          break;
        default:
      }
      this.tempItem  = item
      this.showModal = true
    },
    createData (nameList, idList, terminalList, type) {
      let data  = []
      const arr = this.isNew ? nameList : idList
      for (let i = 0; i < arr.length; i++) {
        data.push({
          id: !this.isNew ? parseInt(idList[i]) : null, 
          name: nameList[i] ? nameList[i] : null,
          type: type
        })
        if (this.itemType == "store") {
          data[i]["terminals"] = terminalList[i] ? parseInt(terminalList[i]) : 0
        }
      }
      return data
    },
    requestAnimation (callback) {
      requestAnimationFrame(() => {
        requestAnimationFrame(callback)
      })
    },
    addButtonClicked () {  
      //textareaを改行で分解して配列に格納
      const nameList      = this.input.name.split(/\r\n|\n/)
      const idList        = this.input.id.split(/\r\n|\n/)
      const terminalList  = this.input.terminal.split(/\r\n|\n/)
      console.log(nameList);
      //入力済みIDの取得
      const enteredIdList = this.getEnteredIdList(this.itemType)
      // inputの端末台数の合計を取得
      let inputTotal = terminalList.reduce(function (accumulator, currentValue) {
        let val = currentValue ? parseInt(currentValue) : 0
        return accumulator + val
      },0)
      
      this.errors         = []
      //validation name
      if (this.isNew && this.isIncludeNull(nameList)) {
        this.errors.push("名称に空文字が含まれています")
      }
      //validation id
      if (!this.isNew && this.isIncludeNull(idList)) {
        this.errors.push("IDに空文字が含まれています")
      }
      if (!this.isNew && !this.isOnlyInt(idList)) {
        this.errors.push("IDは1以上の半角数字で入力してください")
      }
      if (!this.isNew && this.hasSameId(idList, enteredIdList)) {
        this.errors.push("IDが重複しています")
      }
      //validation terminal
      if (this.itemType == "store" && !this.isOnlyInt(terminalList)) {
        this.errors.push("端末台数は半角数字で入力してください")
      }
      // inputの端末台数の合計と入力済みの端末台数の合計が6000を超えないように制限
      if (inputTotal + this.getTerminals() > 6000) {
        this.errors.push("一度に登録可能な端末の最大数(6000)をオーバーしています")
      }
      if (this.errors.length > 0) {
        return
      }
    
      //追加するdataを作成
      let data     = this.createData(nameList, idList, terminalList, this.itemType)
      // loading開始
      const self   = this
      this.loading = true
      // loading animationが開始されてから後続処理実行
      this.requestAnimation(() => {
        //input dataをtree itemに追加
        self.addItem(data)
        self.loading   = false
        self.showModal = false
      })
    },
    addItem (data) {
      //typeによって追加先のプロパティを切り分け
      switch (this.itemType) {
        case "enterprise":
          this.item = this.item.concat(data)
          break;
        case "merchant":
          this.tempItem.merchants = this.tempItem.merchants.concat(data)
          break;
        case "store":
          this.tempItem.stores = this.tempItem.stores.concat(data)
          break;
        default:
      }
    },
    showEditModal (data) {
      this.editModal = true
      this.editData  = data
      this.editInput = {
        id:  data.id,
        name: data.name,
        terminals: data.terminals
      }
    },
    editButtonClicked () {
      // 編集中のID以外のIDリストを取得
      let enteredIdList = this.getEnteredIdList(this.editData.type).filter(n=>n!==this.editData.id)
      // 編集中の端末台数以外の合計台数を取得
      let terminalTotal = this.getTerminals() - parseInt(this.editData.terminals)
      this.errors = []
      
      if (!this.editInput.id && !this.editInput.name) {
        this.errors.push("IDまたは名称のどちらかを記入してください")
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
      this.editData.id   = parseInt(this.editInput.id)
      this.editData.name = this.editInput.name
      if (this.editData.type == "store") {
        this.editData.terminals = this.editInput.terminals ? parseInt(this.editInput.terminals) : 0
      }
      this.editModal = false
    },
    updateId (e) {
      let idList = this.getEnteredIdList(e.item.type)
      if (e.value && this.isOnlyInt([e.value]) && !this.hasSameId([e.value], idList)) {
        e.item.id = parseInt(e.value)
      }
    },
    updateName (e) {
      if (e.item.id) {
        e.item.name = e.value
      } else if (e.value) {
        e.item.name = e.value
      }
    },
    updateTerminals (e) {
      const value = parseInt(e.value)
      if (!e.value) {
        e.item.terminals = 0
      } else if (this.isOnlyInt([value]) && (value + this.getTerminals()) < 6000) {
        e.item.terminals = value
      }
    },
    getEnteredIdList (type) {
      let idList = []
      this.item.forEach(function(value) {
        if (type == "enterprise" && value.id) { idList.push(value.id) }
        if (value.merchants) {
          value.merchants.forEach(function(value) {
            if (type == "merchant" && value.id) {idList.push(value.id)}
            if (value.stores) {
              value.stores.forEach(function(value) {
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
      JSON.parse(JSON.stringify(this.item), function(key, value){  
        if (key == "terminals") { total = total + value }
      })
      return total
    },
    hasSameId (inputIdList, enteredIdList) {
      return inputIdList.some(value => enteredIdList.includes(parseInt(value))) 
             || new Set(inputIdList).size !== inputIdList.length
    },
    isIncludeNull (arr) {
      return arr.includes("")
    },
    isOnlyInt (arr) {
      //stringのままチェックするため正規表現を使用
      const regex = new RegExp(/^([1-9][0-9]*)*$/)
      return arr.every(value => regex.test(value))
    },
    showDeleteModal (data) {
      this.deleteModal = true
      this.deleteData = data
    },
    deleteTrue() {
      this.deleteItem()
    },
    deleteItem () {
      const parent = this.deleteData.parent
      const child  = this.deleteData.child
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
      for (let i = 0, len = parentItem.length; i < len; i++) {
        if (parentItem[i] === child) {
          parentItem.splice(i, 1)
          break
        }
      }
    },
    deleteType (item) {
      let vm = this
      item.forEach(function(value) {
        delete value.type
        if (value.merchants) {
          vm.deleteType(value.merchants)
        } else if (value.stores) {
          vm.deleteType(value.stores)
        }
      })
      return item
    },
    resetModal () {
      this.errors    = []
      this.input     = { id: '', name: '', terminal: ''}
    },
    sendJson () {
      this.jsonToSend  = this.deleteType(this.item)
      this.showJson    = true
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

</style>
