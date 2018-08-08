<template>
  <div class="confirm-policy">
    <HeadTab :numtab="2" />
    <!-- 保单信息 -->
    <div class="confirm_policy c" v-show="isShow">
      <div class="s_m">
        <p><span>确认分期信息</span></p>
        <div class="msg">
          <div class="tit">分期信息</div>
          <div class="w">
            <div class="r">
              <span>姓名：</span><input type="text" v-model="data.userName" disabled>
            </div>
            <div class="r" v-if="data.licenseNumber">
              <span>车牌号：</span><input type="text" v-model="drive" disabled>
            </div>
            <div class="r" v-if="data.certification">
              <span>车架号：</span><input type="text" v-model="drive" disabled>
            </div>
            <div class="r">
              <span>金额：</span><input type="text" v-model="fName" disabled>
            </div>
            <div class="r">
              <span>月付期数：</span><input type="text" v-model="phone" disabled>
            </div>
            <div class="r">
              <span>本期待还：</span><input type="text" v-model="rmoney" disabled>
            </div>
            <div class="r">
              <span>还款截止日期：</span><input type="text" v-model="rtime" disabled>
            </div>
          </div>
          <div class="read_and_agree">
            <input type="radio" id="agree">
            <span style="color: #333;">阅读并同意</span>
            <a v-if="data.monNubmer" :href="url + 'static/images/agreement/个人车险服务协议一年期.pdf'" target="_blank">《车险服务协议》</a>
            <a v-if="data.pMonNubmer" :href="url + 'static/mages/agreement/个人车险服务协议三年期.pdf'" target="_blank">《车险服务协议》</a>
            <a :href="url + 'static/images/agreement/代扣授权协议.pdf'" target="_blank" style="float:right;">《代扣授权协议》</a>
          </div>
          <!-- <button @click="save">去付款</button> -->
          <button type="text" @click="save">去付款</button>
          <el-dialog title="支付信息" :visible.sync="dialogFormVisible" width="630px" style="text-align:left;">
            <el-form :model="form">
              <el-form-item label="姓名：" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="身份证号：" :label-width="formLabelWidth">
                <el-input v-model="form.card" auto-complete="off" @blur="blur($event, 'card')"></el-input>
              </el-form-item>
              <el-form-item label="银行卡号：" :label-width="formLabelWidth">
                <el-input v-model="form.cardNum" auto-complete="off" @blur="blur($event, 'num')"></el-input>
              </el-form-item>
              <el-form-item label="手机号：" :label-width="formLabelWidth">
                <el-input v-model="form.phone" auto-complete="off" @blur="blur($event, 'phone')"></el-input>
              </el-form-item>
              <el-form-item label="验证码：" :label-width="formLabelWidth">
                <el-input v-model="form.codenum" auto-complete="off" style="width:130px;"></el-input>
                <span type="primary" style="margin-top:0;margin-left: 10px; background: #2e92ff;text-align: center;color: #fff;border-radius: 3px;display:block;width: 100px;float:left;cursor:pointer" @click="surePay">获取验证码<span v-if="!show">{{count}}s</span></span>
              </el-form-item>
            </el-form>
            <div class="footer" style="text-align: center;">
              <el-button @click="PayConfirm" style="margin-top:0;background: #2e92ff;margin-right: 20px;">确 定</el-button>
              <button @click="dialogFormVisible = false" style="margin-top:0;">取 消</button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <div class="ok" v-show="!isShow">
      <img src="../assets/ok.png" alt="">
      <p>支付成功！你的月付保单已生成</p>
      <button @click="$router.push('/HomeTable')">回到首页</button>
    </div>
  </div>
</template>

<script>
import HeadTab from './common/HeadTab'
import url from '../assets/Req.js'
export default {
  name: 'ConfirmPolicy',
  data () {
    return {
      drive: '1',
      fName: '2',
      phone: '3',
      isShow: true,
      data: {},
      url: url,
      dialogFormVisible: false,
      form: {
        name: '',
        card: '',
        cardNum: '',
        phone: '',
        codenum: ''
      },
      formLabelWidth: '120px',
      rtime: '',
      rmoney: '',
      count: '',
      show: true,
      dataOid: ''
    }
  },
  mounted () {
    this.getInfoData()
  },
  methods: {
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
    PayConfirm () {
      if (this.form.codenum === '') {
        this.$message({
          type: 'info',
          message: '请输入验证码'
        })
      } else {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$http.get(url + 'pay/durch', {
          params: {
            'token': sessionStorage.getItem('userId'),
            'code': this.form.codenum,
            'id': this.dataOid
          }
        }).then(res => {
          // console.log(res.data)
          if (res.data.code === 200) {
            this.dialogFormVisible = false
            loading.close()
            this.isShow = false
          } else {
            loading.close()
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      }
    },
    blur (e, data) {
      if (data === 'card') {
        var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
        if (!reg.test(e.target.value)) {
          e.target.style.borderColor = 'red'
          this.$message({
            type: 'info',
            message: '您输入的身份证号格式不正确，请重新输入'
          })
        } else {
          e.target.style.borderColor = '#dcdfe6'
        }
      } else if (data === 'num') {
        var reg1 = /^([1-9]{1})(\d{14}|\d{18})$/
        if (!reg1.test(e.target.value)) {
          e.target.style.borderColor = 'red'
          this.$message({
            type: 'info',
            message: '您输入的银行卡号格式不正确，请重新输入'
          })
        } else {
          e.target.style.borderColor = '#dcdfe6'
        }
      } else if (data === 'phone') {
        var reg2 = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!reg2.test(e.target.value)) {
          e.target.style.borderColor = 'red'
          this.$message({
            type: 'info',
            message: '您输入的手机号格式不正确，请重新输入'
          })
        } else {
          e.target.style.borderColor = '#dcdfe6'
        }
      }
    },
    // 支付接口 获取验证码
    surePay (e) {
      if (this.show === true) {
        if (this.form.name === '') {
          this.$message({
            type: 'info',
            message: '姓名不能为空'
          })
        } else if (this.form.card === '') {
          this.$message({
            type: 'info',
            message: '证件号不能为空'
          })
        } else if (this.form.cardNum === '') {
          this.$message({
            type: 'info',
            message: '银行卡号不能为空'
          })
        } else if (this.form.phone === '') {
          this.$message({
            type: 'info',
            message: '手机号不能为空'
          })
        } else {
          var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
          var reg1 = /^([1-9]{1})(\d{14}|\d{18})$/
          var reg2 = /^[1][3,4,5,7,8][0-9]{9}$/
          if (!reg.test(this.form.card)) {
            this.$message({
              type: 'info',
              message: '您输入的身份证号格式不正确，请重新输入'
            })
          } else if (!reg1.test(this.form.cardNum)) {
            this.$message({
              type: 'info',
              message: '您输入的银行卡号格式不正确，请重新输入'
            })
          } else if (!reg2.test(this.form.phone)) {
            this.$message({
              type: 'info',
              message: '您输入的手机号格式不正确，请重新输入'
            })
          } else {
            this.getCodeCount(e)
            this.$http.get(url + 'pay/apply', {
              params: {
                'token': sessionStorage.getItem('userId'),
                'name': this.form.name,
                'cardid': this.form.card,
                'bankcard': this.form.cardNum,
                'phone': this.form.phone,
                'id': this.data.oid
              }
            }).then(res => {
              // console.log(res.data.data)
              if (res.data.code === 200) {
                this.dataOid = res.data.data
                this.$message({
                  type: 'info',
                  message: '短信发送成功！'
                })
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
    save () {
      var agree = document.getElementById('agree')
      if (agree.checked === true) {
        this.dialogFormVisible = true
      } else {
        this.$message({
          type: 'info',
          message: '请阅读并同意车险服务协议'
        })
      }
    },
    // 获取保单信息
    getInfoData () {
      let that = this
      that.$http.get(url + 'personal/getPersonalByid', {
        params: {
          id: this.$route.query.id,
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        this.data = res.data.data
        this.form.card = res.data.data.cardId
        this.form.name = res.data.data.userName
        this.form.phone = res.data.data.phone
        if (res.data.data.licenseNumber) {
          this.drive = res.data.data.licenseNumber
        } else {
          this.drive = res.data.data.certification
        }
        // console.log(this.drive)
        this.fName = (res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport) + '元'
        this.phone = res.data.data.monNubmer
        that.$http.get(url + 'stages/getStageDetailsByid', {
          params: {
            id: this.$route.query.id,
            token: sessionStorage.getItem('userId')
          }
        }).then(res => {
          // console.log(res.data)
          let date = new Date(res.data.data.rtime)
          this.rtime = date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
          this.rmoney = res.data.data.rmoney
        })
      })
    }
  },
  components: {
    HeadTab
  }
}
function addZero (num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}
</script>

<style lang="less" scoped>
.confirm-policy {
  position: relative;
  .el-dialog__header {
    background: #2E92FF;
  }
  .el-input, .el-textarea, .el-select {
    width: 430px;
    float: left;
  }
  button {
    margin-top: 0;
  }
  .c {
    font-size: 14px;
    .s_m {
      background: #fff;
      width: 100%;
      p {
        background: rgb(206, 227, 250);
        margin-bottom: 65px;
        span {
          text-align: left;
          font-size: 18px;
          height: 22px;
          line-height: 50px;
          border-left: 2px solid #2e92ff;
          padding-left: 13px;
          margin-left: 30px;
          margin-bottom: 50px;
        }
      }
      .msg {
        width: 1050px;
        margin: 0 auto;
        text-align: center;
        padding: 0 20px;
        .tit {
          text-align: left;
          width: 1050px;
          margin: 0 auto 42px;
          font-size: 18px;
          height: 22px;
          line-height: 22px;
          border-left: 2px solid #2e92ff;
          padding-left: 13px;
        }
        .w {
          width: 1050px;
          margin: 0 auto;
          padding-bottom: 30px;
          .r {
            line-height: 30px;
            padding-bottom: 13px;
            span {
              display: inline-block;
              width: 125px;
              text-align: right;
              i {
                color: #e8264e;
              }
            }
            input[type="text"] {
              width: 920px;
              height: 30px;
              border: 0;
              border:1px solid #ccc;
              border-radius: 3px;
              text-indent: 6px;
              background: #fff;
            }
          }
        }
        .read_and_agree {
          text-align: right;
          color: #2E92FF;
          font-size: 16px;
          a {
            color: #2E92FF;
          }
          .download {
            margin: 0;
            width: 60px;
            height: 30px;
            background: #fff;
            border: #2e92ff 1px solid;
            color: #2E92FF;
            border-radius: 0;
          }
        }
        button {
          width: 85px;
          height: 40px;
          border: 0;
          background: #2E92FF;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;
          outline: none;
          margin-top: 220px;
        }
      }
    }
  }
  .ok {
    font-size: 18px;
    width: 400px;
    margin: 15% auto 0;
    text-align: center;
    p {
      margin: 20px 0;
    }
    button {
      color: #fff;
      background: #2E92FF;
      border-radius: 3px;
      border: 0;
      width: 400px;
      height: 50px;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>
