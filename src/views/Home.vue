<template>
  <div>
    <b-button variant="info" block class="w-25 mx-auto" @click="$router.push({name:'register'})">台帳スケルトン作成</b-button>
    <b-button variant="info" block class="w-25 mx-auto" @click="$router.push({name:'uploadExcel'})">台帳一括登録</b-button>
  </div>
</template>

<script>
export default {
  name: 'home'
}
</script>
