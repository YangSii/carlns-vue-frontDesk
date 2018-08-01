<template>
  <div class="application">
    <img src="../assets/success.png" alt="">
    <p>您已成功提交申请，正在审核中。。。</p>
    <button @click="$router.push('/')">确定</button>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.application {
  text-align: center;
  img {
    width: 380px;
    display: block;
    margin: 120px auto 10px;
  }
  p {
    font-size: 20px;
    line-height: 100px;
  }
  button {
    width: 200px;
    height: 50px;
    background: #28a6ee;
    color: #fff;
    border: 0;
    border-radius: 5px;
    outline: none;
    // margin-top: 50px;
    cursor: pointer;
  }
}
</style>
