<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    if (!sessionStorage.getItem('userId')) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less">
*{padding: 0;margin: 0;}
li {
  list-style: none;
}
a {
  text-decoration: none;
  color: #2e92ff;
}
i, b{
  font-weight: normal;
  font-style: normal;
}
html, body {
  height: 100%;
}
#app {
  height: 100%;
  font-size: 12px;
  min-width: 1450px;
}
::-webkit-scrollbar {/*滚动条整体样式*/
  width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background: rgba(0,0,0,0.1);
  width: 1px;
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  border-radius: 0;
  background: rgba(0,0,0,0.01);
}
</style>
