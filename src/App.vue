<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

*{
  margin: 0;
  padding: 0;
}

body,html{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.el-button--goon.is-active,
.el-button--goon:active {
  background: #ab0427;
  border-color: #ab0427;
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: #f1f1f1;
  border-color: #a92d47;
  color: #a92d47;
}

.el-button--goon {
  color: #FFF;
  background-color: #ab0427;
  border-color: #ab0427;
}

.el-button--admin.is-active,
.el-button--admin:active {
  background: #459314;
  border-color: #459314;
  color: #fff;
}

.el-button--admin:focus,
.el-button--admin:hover {
  background: #f1f1f1;
  border-color: #459314;
  color: #459314;
}

.el-button--admin {
  color: #FFF;
  background-color: #459314;
  border-color: #459314;
}


</style>
