<template>
  <div class="condition">
    <h2>申请条件</h2>
    <div class="application_body">
      <div class="t">
        <div class="tit">所需材料</div>
        <div class="w">
          <p>1、营业执照及银行开户行许可证（复印件加盖公章）</p>
          <p>2、法人身份证（复印件加盖公章）</p>
          <p>3、负责人身份证（复印件加盖公章）</p>
          <p>4、代理商合作协议（加盖公章）</p>
        </div>
      </div>
      <div class="b">
        <div class="tit">邮寄地址</div>
        <div class="w">
          <h5>请将以上所需证件寄到以下地址：</h5>
          <p>上海市虹口区大连路1053号C座305-306室</p>
          <p>联系人：王先生</p>
          <p>电   话：021-65033858</p>
          <p>我们会再2个工作日内审核，审核成功会以短信方式告知</p>
        </div>
      </div>
    </div>
    <button @click="$router.push('/Application')">提交</button>
  </div>
</template>

<script>
export default {
  name: 'Condition',
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.condition {
  text-align: center;
  h2 {
    text-align: left;
    height: 60px;
    background: #2E92FF;
    font-size: 18px;
    color: #fff;
    line-height: 60px;
    padding-left: 40px;
    font-weight: normal;
  }
  .application_body {
    text-align: left;
    background: #fff;
    width: 1300px;
    margin: 0 auto;
    font-size: 14px;
    overflow: hidden;
    .tit{
      text-align: left;
      font-size: 14px;
      margin-top: 50px;
      padding-left: 20px;
      border-left: 2px solid blue;
    }
    .w {
      width: 900px;
      overflow: hidden;
      margin: 40px auto 30px;
      h5 {
        line-height: 40px;
        font-size: 16px;
        font-weight: normal;
        color: rgb(255, 166, 0);
      }
      p{
        line-height: 40px;
        font-size: 16px;
      }
      .r {
        margin-bottom: 20px;
        float: left;
        width: 50%;
        input[type="text"] {
          border: 0;
          border-bottom: #f2f2f2 1px solid;
          width: 200px;
          outline: none;
        }
        span{
          text-align: right;
          padding-right: 20px;
          display: inline-block;
          width: 100px;
        }
      }
    }
    figure {
      width: 300px;
      border: 1px solid #00ff00;
    }
  }
  button {
    width: 200px;
    height: 50px;
    background: #28a6ee;
    color: #fff;
    border: 0;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
  }
}
</style>
