<template>
  <div>
    <b-alert variant="success" dismissible :show="successAlert" @dismissed="successAlert=false">アップロードが完了しました</b-alert>
    <b-alert variant="danger" dismissible :show="errorAlert" @dismissed="errorAlert=false">アップロードに失敗しました</b-alert>
    <b-card class="mx-auto" style="width:670px;">    
      <div class="input-group">
        <label class="input-group-btn">
          <span class="btn btn-outline-primary">
            ファイルを選択<input type="file" accept=".xlsx" style="display:none" @change="onFileChange">
          </span>
        </label>
        <input type="text" class="form-control" readonly="" v-model="fileName">
      </div>
      <span class="float-left text-danger">{{error}}</span>
      <b-button block class="w-25 mx-auto mt-5 " href="#" variant="primary" @click="upload">送信する</b-button>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'uploadExcel',
    data: () => {
      return {
        fileName: null,
        file: null,
        error: null,
        successAlert: false,
        errorAlert: false
      }
    },
    methods: {
      onFileChange(e) {
        this.error = null
        let files  = e.target.files || e.dataTransfer.files
        if(files.length == 0) return
        
        this.file = files[0]
        this.fileName = files[0].name ? files[0].name : ""
  
        // excelファイル以外はreturn
        if (this.getExtension(this.fileName) != "xlsx") return
        
        //同じファイル名を選択した時用 
        e.target.value = null
      },
      getExtension(fileName) {
        let ret
        if (!fileName) {
          return ret
        }
        const fileTypes = fileName.split(".")
        const len       = fileTypes.length
        if (len === 0) {
          return ret
        }
        ret = fileTypes[len - 1]
        return ret
      },
      upload() {
        if (this.file == null) {
          this.error = "ファイルを選択してください"
          return
        }
        const url = "https://1o2h0lz7dd.execute-api.ap-northeast-1.amazonaws.com/Prod/importer"
        const params = new FormData();
        params.append('file', this.file);

        this.$axios.post(url, params, { headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
          this.successAlert = true
        })
        .catch(error => {
          this.errorAlert = true
        })
        .finally(() => {
          this.file = null
          this.fileName = null
        })
      }
    }
  }
</script>