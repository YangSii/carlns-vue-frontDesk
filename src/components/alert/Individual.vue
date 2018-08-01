<template>
  <div class="Individual">
    <HeadTab :numtab="2" />
    <!-- 保单信息 -->
    <div class="confirm_policy c" v-show="isShow">
      <div class="s_m">
        <p><span>待分期信息</span></p>
        <div class="msg">
          <div class="tit">基本信息</div>
          <div class="w">
            <div class="r">
              <span>姓名：</span><input type="text" v-model="data.userName" disabled>
            </div>
            <div class="r">
              <span v-if="data.pLicenseNumber">车牌号：</span><input v-if="data.pLicenseNumber" type="text" v-model="drive" disabled>
              <span v-if="data.licenseNumber">车牌号：</span><input v-if="data.licenseNumber" type="text" v-model="drive" disabled>
            </div>
            <div class="r">
              <span v-if="data.pCertification">车架号：</span><input v-if="data.pCertification" type="text" v-model="drive" disabled>
              <span v-if="data.certification">车架号：</span><input v-if="data.certification" type="text" v-model="drive" disabled>
            </div>
            <div class="r">
              <span>分期金额：</span><input type="text" v-model="fName" disabled>
            </div>
            <div class="r two">
              <span>分期期数：</span><input type="text" v-model="phone" disabled><input type="button" value="分期详情" @click="check(data.id, 2)">
            </div>
            <div class="r two">
              <span>状态：</span><span class="input">{{ data.status | statusFilter }}</span><input
              v-if="data.status === 1"
              style="border-color:#ccc;color:#ccc;"
              type="button" value="付款" disabled><input
              v-if="data.status === 2" type="button"
              @click="$router.push({name: 'ConfirmPolicy', query: {id: data.id, logtab: 1}})"
              value="付款">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分期详情 -->
    <PersonDetail v-if="detailShow" :tableData="checkDetailData" @PersonDetail="PersonDetail" />
  </div>
</template>

<script>
import HeadTab from '../common/HeadTab'
import PersonDetail from '../alert/PersonDetail'
import url from '../../assets/Req.js'
export default {
  name: 'Individual',
  data () {
    return {
      drive: '1',
      fName: '2',
      phone: '3',
      isShow: true,
      detailShow: false,
      data: [],
      url: url,
      checkDetailData: {}
    }
  },
  mounted () {
    this.getInfoData()
  },
  methods: {
    PersonDetail (data) {
      this.detailShow = false
    },
    check (data, status) {
      let that = this
      this.detailShow = true
      that.$http.get(url + 'personal/getPersonalByid', {
        params: {
          id: data,
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data)
        this.aaa = false
        this.checkDetailData = {
          'id': res.data.id,
          'year': res.data.data.yearsNubmer,
          'mon': res.data.data.monNubmer,
          'money': res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport,
          'date': res.data.data.createTime,
          'status': Number(res.data.data.scheduleImage),
          'status1': res.data.data.monNubmer - Number(res.data.data.scheduleImage),
          'data': [
            {'kind': '姓名：', 'data': res.data.data.userName},
            {'kind': '车牌号：', 'data': res.data.data.licenseNumber},
            {'kind': '分期金额：', 'data': res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport},
            {'kind': '分期期数：', 'data': res.data.data.monNubmer}
          ]
        }
        if (res.data.data.certification) {
          this.checkDetailData.data[1].data = res.data.data.certification
          this.checkDetailData.data[1].kind = '车架号：'
        } else {
          this.checkDetailData.data[1].data = res.data.data.licenseNumber
          this.checkDetailData.data[1].kind = '车牌号：'
        }
      })
    },
    save () {
      var agree = document.getElementById('agree')
      // console.log(agree.checked)
      if (agree.checked === true) {
        let that = this
        if (this.$route.query.logtab === 1) {
          that.$http.get(url + 'message/insertEnterpriseMessage', {
            params: {
              'id': this.data.id,
              'token': sessionStorage.getItem('userId')
            }
          }).then(res => {
            // console.log('发送企业消息')
            if (res.data.msg === 'success') {
              this.isShow = false
            }
          })
        } else {
          // that.$http.get(url + 'message/insertPersonalMessage', {
          //   params: {
          //     'id': this.data.id,
          //     'token': sessionStorage.getItem('userId')
          //   }
          // }).then(res => {
          //   console.log('发送个人消息')
          //   if (res.data.msg === 'success') {
          this.isShow = false
          //   }
          // })
        }
      } else {
        alert('请阅读并同意车险服务协议')
      }
    },
    // 获取保单信息
    getInfoData () {
      let that = this
      if (this.$route.query.logtab === 1) {
        that.$http.get(url + 'enterprise/getEnterpriseByid', {
          params: {
            id: this.$route.query.id,
            token: sessionStorage.getItem('userId')
          }
        }).then(res => {
          // console.log('qiye')
          // console.log(res.data.data)
          this.data = res.data.data
          if (res.data.data.pLicenseNumber) {
            this.drive = res.data.data.pLicenseNumber
          } else {
            this.drive = res.data.data.pCertification
          }
          this.fName = (res.data.data.pBusinessRisks + res.data.data.pInsuranceRisks + res.data.data.pTransport) + '元'
          this.phone = res.data.data.pMonNubmer
        })
      } else {
        that.$http.get(url + 'personal/getPersonalByid', {
          params: {
            id: this.$route.query.id,
            token: sessionStorage.getItem('userId')
          }
        }).then(res => {
          // console.log('geren')
          // console.log(res.data.data)
          this.data = res.data.data
          if (res.data.data.licenseNumber) {
            this.drive = res.data.data.licenseNumber
          } else {
            this.drive = res.data.data.certification
          }
          // console.log(this.drive)
          this.fName = (res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport) + '元'
          this.phone = res.data.data.monNubmer
        })
      }
    }
  },
  components: {
    PersonDetail,
    HeadTab
  },
  filters: {
    statusFilter (data) {
      if (data === 1) return '审核中'
      if (data === 2) return '待分期'
      if (data === 3) return '已分期'
      if (data === 4) return '退保中'
      if (data === 5) return '已退保'
      if (data === 6) return '待确认分期'
      if (data === 7) return '审核未通过'
    }
  }
}
</script>

<style lang="less" scoped>
.Individual {
  position: relative;
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
            .input {
              width: 810px;
              height: 30px;
              border: 0;
              border:1px solid #ccc;
              border-radius: 3px;
              text-indent: 6px;
              background: #fff;
              text-align: left;
              color: #2e92ff;
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
          .two {
            input[type="text"] {
              width: 810px;
            }
            input[type="button"] {
              width: 80px;
              height: 30px;
              border: 0;
              border: 1px solid #2e92ff;
              background: #fff;
              color: #2e92ff;
              margin-left: 30px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
