<template>
  <div class="login">
    <div class="login_box" v-if="isForget">
      <div class="login_head">欢迎登录</div>
      <div class="login_input">
        <div class="input_msg">
          <div><img src="../assets/user.png" alt=""></div>
          <input type="text" placeholder="请输入您的账号" v-model="user">
        </div>
        <div class="input_msg">
          <div><img src="../assets/password.png" alt=""></div>
          <input type="password" placeholder="请输入您的密码" v-model="password">
        </div>
        <div class="code">
          <input type="text" placeholder="请输入右图的验证码" v-model="codenumber">
          <div class="code_img" @click="getCode">
            <img :src="code" alt="">
          </div>
        </div>
        <button @click="login">登录</button>
        <a @click="isForget = false">忘记密码</a>
        <router-link class="apply" to="/ChannelApplication">点我进行渠道代理申请</router-link>
      </div>
    </div>
    <div class="login_box" v-if="!isForget">
      <div class="login_head">修改密码</div>
      <div class="login_input">
        <div class="input_msg">
          <div><img src="../assets/user.png" alt=""></div>
          <input type="text" placeholder="请输入您的手机号" v-model="userPhone">
        </div>
        <div class="code phone">
          <input type="text" placeholder="请输入验证码" v-model="codeNum">
          <div class="code_img" @click="getCodeNum">
            <button>获取验证码<span v-if="!show">{{count}}s</span></button>
          </div>
        </div>
        <div class="input_msg">
          <div><img src="../assets/password.png" alt=""></div>
          <input type="password" placeholder="请输入不少于六位数的新密码" v-model="forgetPsd">
        </div>
        <div class="input_msg">
          <div><img src="../assets/password.png" alt=""></div>
          <input type="password" placeholder="请确认您的新密码" v-model="forgetFsdConf">
        </div>
        <button @click="ForgetConfirm">确定</button>
        <a @click="back">返回登录</a>
        <!-- <router-link class="apply" to="/ChannelApplication">点我进行渠道代理申请</router-link> -->
      </div>
    </div>
  </div>
</template>

<script>
import url from '../assets/Req.js'
export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: '',
      code: '',
      codenumber: '',
      userPhone: '',
      codeNum: '',
      forgetPsd: '',
      forgetFsdConf: '',
      isForget: true,
      show: true,
      count: '',
      timer: null
    }
  },
  mounted () {
    this.getCode()
  },
  methods: {
    back () {
      this.isForget = true
      this.codenumber = ''
    },
    // 倒计时
    getCodeCount (e) {
      // console.log(e)
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        e.target.style.backgroundColor = '#ccc'
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            e.target.style.backgroundColor = '#2E92FF'
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    // 忘记密码
    ForgetConfirm () {
      // common/updatePwd?phone=13412341234&code=2233&pwd=23412411
      var that = this
      if (this.userPhone === '') {
        this.$message({
          type: 'info',
          message: '手机号不能为空'
        })
      } else if (this.codeNum === '') {
        this.$message({
          type: 'info',
          message: '验证码不能为空'
        })
      } else if (this.forgetPsd === '') {
        this.$message({
          type: 'info',
          message: '密码不能为空'
        })
      } else {
        var myreg1 = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg1.test(this.userPhone)) {
          this.$message({
            type: 'error',
            message: '您输入的手机号不正确!'
          })
        } else {
          if (this.forgetPsd === this.forgetFsdConf) {
            that.$http.get(url + 'common/updatePwd', {
              params: {
                phone: this.userPhone,
                code: this.codeNum,
                pwd: this.forgetPsd
              }
            }).then(res => {
              // console.log(res)
              // console.log(res.data)
              if (res.data.msg === 'success') {
                this.isForget = true
                this.userPhone = ''
                this.forgetFsdConf = ''
                this.forgetPsd = ''
                this.codeNum = ''
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '两次密码输入不一致!'
            })
          }
        }
      }
    },
    // 获取动态验证码
    getCodeNum (e) {
      // common/getCode?phone=1031241234
      if (this.show === true) {
        var that = this
        if (this.userPhone === '') {
          this.$message({
            type: 'info',
            message: '手机号不能为空'
          })
        } else {
          var myreg1 = /^[1][3,4,5,7,8][0-9]{9}$/
          if (!myreg1.test(this.userPhone)) {
            this.$message({
              type: 'error',
              message: '您输入的手机号不正确!'
            })
          } else {
            that.$http.get(url + 'common/getCode', {
              params: {
                phone: this.userPhone
              }
            }).then(res => {
              if (res.data.msg === 'success') {
                this.getCodeCount(e)
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
          }
        }
      }
    },
    // 获取图片验证码
    getCode () {
      var that = this
      that.$http.get(url + 'common/ajaxIdentifyingCode?' + Math.random()).then(res => {
        // console.log(res)
        // console.log(res.data.data)
        this.code = res.data.data
      })
    },
    // 登录按钮
    login () {
      // this.$router.push('/CompanyHome')
      if (this.user === '') {
        alert('请输入用户名')
      } else if (this.password === '') {
        alert('请输入密码')
      } else if (this.codenumber === '') {
        alert('请输入验证码')
      } else {
        var that = this
        that.$http.get(url + 'login/login', {
          params: {
            account: this.user,
            password: this.password,
            code: this.codenumber
          }
        }).then(res => {
          // console.log(res)
          if (res.data.code === 200) {
            sessionStorage.setItem('userId', res.data.data)
            this.$router.push('/HomeTable')
          } else {
            this.getCode()
            this.codenumber = ''
            this.$message({
              type: 'info',
              message: res.data.msg
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-image: url(../assets/bg.png);
  .login_box {
    width: 380px;
    height: 430px;
    box-sizing: border-box;
    padding: 0 36px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 10px;
    background: white;
    box-shadow: 5px 0px 15px 5px rgba(0, 0, 0, 0.16);
    overflow: hidden;
    .login_head {
      font-size: 20px;
      font-family: 'Arial';
      padding: 18px 0 28px 0;
    }
    .login_input {
      .input_msg {
        width: 300px;
        height: 40px;
        border: 1px solid #cecece;
        border-radius: 4px;
        margin-bottom: 20px;
        overflow: hidden;
        div {
          line-height: 47px;
          float: left;
          border-right: 1px solid #cecece;
          width: 40px;
          text-align: center;
          background: #f5f5f5;
        }
        input {
          line-height: 40px;
          height: 40px;
          float: left;
          border: 0;
          text-indent: 18px;
          outline: none;
          width: 250px;
        }
      }
      button {
        cursor: pointer;
        width: 300px;
        height: 40px;
        border-radius: 4px;
        background: #2E92FF;
        color: #fff;
        border: 0;
        outline: none;
        margin: 32px auto 0;
        display: block;
        font-size: 18px;
      }
      a {
        line-height: 30px;
        cursor: pointer;
        float: left;
        padding: 15px 20px 0 0;
      }
      .apply {
        // display: block;
        float: right;
        cursor: pointer;
        text-align: right;
        padding: 15px 20px 0 0;
      }
    }
  }
  .code {
    &.phone {
      margin-bottom: 20px;
      button {
        margin: 0;
        width: 100%;
        font-size: 15px;
      }
    }
    overflow: hidden;
    input {
      border: 1px solid #cecece;
      height: 40px;
      outline: none;
      width: 180px;
      text-indent: 10px;
      border-radius: 4px;
      float: left;
    }
    .code_img {
      width: 110px;
      height: 40px;
      border: 1px solid #cecece;
      border-radius: 4px;
      float: left;
      margin-left: 10px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
