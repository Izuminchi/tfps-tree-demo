<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style lang="scss">
/* Import Font Awesome Icons Set */
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';
@import '~@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
@import '~@fortawesome/fontawesome-free-webfonts/css/fa-regular.css';
@import '~@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  font-family: Menlo, Consolas, monospace;
  color: #444;
}
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
ul {
  list-style-type: none;
  text-align: left;
}
ul li, ol li {
  line-height: 1.5;
  padding: 0.5em 0;
}

</style>
