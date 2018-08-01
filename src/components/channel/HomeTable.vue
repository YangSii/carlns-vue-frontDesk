<template>
  <div class="home-table">
    <HeadTab :numtab="0" />
    <!-- 通知中心 -->
    <div class="right r" id="right">
      <div class="title"><span>通知中心</span></div>
      <div class="message">
        <div class="message_t">
          <div class="m_t" v-for="(item, index) in tab" :key="index" :class="{active:index == num}" @click="tabs(index)">{{ item }}</div>
        </div>
        <div class="message_c">
          <div class="mark" v-if="isRead">
            <div class="checkbox">
              <input type="checkbox" id="checkbox" @change="readMessage($event)">
              <img src="../../assets/ok.png" alt="">
            </div> 全选
            <a @click="readMark">标记为已读</a>
          </div>
          <div class="figure" v-for="(item, index) in noReadList" :key="index">
            <div class="checkbox" ref="child" v-if="isRead">
              <input type="checkbox" @change="readMessage($event, item.id)">
              <img src="../../assets/ok.png" alt="">
            </div>
            <span class="text_show" :title="item.content">
              <span><span style="color:#fe952b;">[{{ item.remarks }}] </span>{{ item.content }}</span><br>
              <span>{{ item.createDate | formateDate }}</span>
            </span>
            <a class="delete" @click="delt(item.id)">删除</a>
          </div>
        </div>
        <div class="page">
          <PageChange :pageNumber="length.length" @prev="prev"/>
        </div>
      </div>
    </div>
    <div class="left" id="left">
      <div class="top r">
        <div class="title"><span>正在投保</span></div>
        <ttt :pay="false" @tableDetail="tableDetail" @tableListDetail="tableListDetail" :data="data"></ttt>
        <div class="table_page">
          <PageChange :pageNumber="toubaoLength.length" @prev="prev1"/>
        </div>
      </div>
      <div class="bottom r">
        <div class="title"><span>待付款</span></div>
        <ttt :pay="true"
          @tableListDetail="tableListDetail"
          @tableDetail="tableDetail"
          @uploadPaymentPlan="uploadPaymentPlan"
          @uploadPaymentVoucher="uploadPaymentVoucher"
          :data="list"></ttt>
        <div class="table_page">
          <PageChange :pageNumber="fukuanLength.length" @prev="prev2"/>
        </div>
      </div>
    </div>
    <!-- 分期详情 -->
    <PersonDetail v-if="detailShow" :tableData="tableData" @PersonDetail="PersonDetail" />
    <!-- 分期计划表 -->
    <div class="pay_detail" v-if="detailListShow" id="closeList" @click="close($event)">
      <div class="detail_table det">
        <img v-if="imgSrc" :src="'http://192.168.1.110/' + imgSrc" alt="">
        <span v-if="!imgSrc">请上传付款计划表</span>
      </div>
    </div>
    <!-- 上传付款计划表 -->
    <PayPlan v-if="uploadPayPlan" @PayPlan="PayPlan" :id="id"/>
    <!-- 上传付款凭证 -->
    <PayVorcher v-if="uploadPay" @PayVorcher="PayVorcher" :id="id"/>
  </div>
</template>

<script>
import HeadTab from '../common/HeadTab'
import url from '../../assets/Req.js'
import ttt from './ttt'
import PageChange from './PageChange'
import PersonDetail from '../alert/PersonDetail'
import PayVorcher from '../alert/PayVorcher'
import PayPlan from '../alert/PayPlan'
export default {
  name: 'HomeTable',
  data () {
    return {
      num: 0,
      tab: ['未读', '已读'],
      data: [],
      tableData: {},
      detailShow: false,
      detailListShow: false,
      list: [],
      noReadList: [],
      length: [],
      isRead: true,
      readArr: [],
      imgSrc: '',
      toubaoLength: [],
      fukuanLength: [],
      uploadPayPlan: false,
      uploadPay: false,
      id: ''
    }
  },
  mounted () {
    this.getToubaoData()
    window.addEventListener('resize', this.handler)
    if (document.documentElement.clientWidth < 1450) {
      document.getElementById('left').style.width = 980 + 'px'
      // document.getElementById('right').style.width = 300 + 'px'
    } else {
      document.getElementById('right').style.width = 400 + 'px'
      document.getElementById('left').style.width = document.documentElement.clientWidth - 460 + 'px'
    }
  },
  methods: {
    PayPlan () {
      this.uploadPayPlan = false
    },
    PayVorcher () {
      this.uploadPay = false
      this.getToubaoData()
    },
    PersonDetail (data) {
      this.detailShow = false
    },
    uploadPaymentVoucher (id) {
      this.id = id[0]
      this.uploadPay = true
    },
    uploadPaymentPlan (id) {
      this.id = id[0]
      this.uploadPayPlan = true
    },
    handler () {
      if (document.documentElement.clientWidth < 1450) {
        document.getElementById('left').style.width = 980 + 'px'
        // document.getElementById('right').style.width = 300 + 'px'
      } else {
        document.getElementById('right').style.width = 400 + 'px'
        document.getElementById('left').style.width = document.documentElement.clientWidth - 460 + 'px'
      }
      // console.log(document.documentElement.clientWidth)
    },
    prev (data) {
      this.noReadList = this.length.slice((data - 1) * 6, data * 6)
    },
    prev1 (data) {
      this.data = this.toubaoLength.slice((data - 1) * 6, data * 6)
    },
    prev2 (data) {
      this.list = this.fukuanLength.slice((data - 1) * 6, data * 6)
    },
    // 标记为已读
    readMark () {
      if (this.readArr.length === 0) {
        alert('未选择消息')
      } else {
        let that = this
        that.$http.get(url + 'message/ConvertReadMessage', {
          params: {
            'ids': JSON.stringify(this.readArr),
            'token': sessionStorage.getItem('userId')
          }
        }).then(res => {
          // console.log(res.data)
          this.getToubaoData()
          for (var i = 0; i < this.$refs.child.length; i++) {
            this.$refs.child[i].children[1].style.display = 'none'
          }
        })
      }
    },
    readMessage (e, id) {
      if (e.target.checked === true) {
        e.target.nextElementSibling.style.display = 'block'
        if (id) {
          this.readArr.push(id)
        }
        if (e.target === document.getElementById('checkbox')) {
          this.readArr = []
          for (var i = 0; i < this.$refs.child.length; i++) {
            this.$refs.child[i].children[1].style.display = 'block'
            this.$refs.child[i].children[0].checked = true
          }
          this.noReadList.forEach(v => {
            this.readArr.push(v.id)
          })
        }
      } else {
        this.readArr.splice(this.readArr.indexOf(id), 1)
        e.target.nextElementSibling.style.display = 'none'
        document.getElementById('checkbox').checked = false
        document.getElementById('checkbox').nextElementSibling.style.display = 'none'
        if (e.target === document.getElementById('checkbox')) {
          this.readArr = []
          for (var j = 0; j < this.$refs.child.length; j++) {
            this.$refs.child[j].children[1].style.display = 'none'
            this.$refs.child[j].children[0].checked = false
          }
        }
      }
    },
    // 删除消息
    delt (id) {
      let that = this
      that.$http.get(url + 'message/deleteMessage', {
        params: {
          'id': id,
          'token': sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data)
        this.getToubaoData()
        this.num = 0
      })
    },
    // 关闭弹窗
    close (e) {
      if (e.target === document.getElementById('close')) {
        this.detailShow = false
      }
      if (e.target === document.getElementById('closeList')) {
        this.detailListShow = false
      }
      if (e.target === document.getElementById('uplaod_payment_plan')) {
        this.uploadPayPlan = false
      }
      if (e.target === document.getElementById('upoad_payment_voucher')) {
        this.uploadPay = false
      }
    },
    // 分期计划表
    tableListDetail (data) {
      this.detailListShow = true
      this.imgSrc = data
    },
    // 分期详情
    tableDetail (data) {
      // console.log(data)
      this.detailShow = true
      let that = this
      that.$http.get(url + 'personal/getPersonalByid', {
        params: {
          'id': data[0],
          'token': sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data.data.scheduleImage)
        this.tableData = {
          'id': data[0],
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
          this.tableData.data[1].data = res.data.data.certification
          this.tableData.data[1].kind = '车架号：'
        } else {
          this.tableData.data[1].data = res.data.data.licenseNumber
          this.tableData.data[1].kind = '车牌号：'
        }
        // console.log(this.tableData)
      })
    },
    // 已读未读的切换
    tabs (index) {
      this.num = index
      let that = this
      if (Number(index) === 0) {
        this.isRead = true
      } else {
        this.isRead = false
      }
      that.$http.get(url + 'message/getisReadMessage', {
        params: {
          'isRead': (Number(index) + 1),
          'token': sessionStorage.getItem('userId')
        }
      }).then(res => {
        this.noReadList = res.data.data.slice(0, 6)
        this.length = res.data.data
      })
    },
    getToubaoData () {
      let that = this
      // 正在投保
      that.$http.get(url + 'common/getList', {
        params: {
          status: '1',
          token: sessionStorage.getItem('userId'),
          page: '1',
          row: '6'
        }
      }).then(res => {
        // console.log(res.data)
        this.data = res.data.data.slice(0, 6)
        this.toubaoLength = res.data.data
      })
      // 待付款
      that.$http.get(url + 'common/getList', {
        params: {
          status: '2',
          token: sessionStorage.getItem('userId'),
          page: '1',
          row: '6'
        }
      }).then(res => {
        // console.log(res.data)
        this.list = res.data.data.slice(0, 6)
        this.fukuanLength = res.data.data
      })
      // 未读消息
      that.$http.get(url + 'message/getisReadMessage?isRead=1&token=' + sessionStorage.getItem('userId')).then(res => {
        // console.log(res.data.data)
        this.noReadList = res.data.data.slice(0, 5)
        this.length = res.data.data
      })
    }
  },
  components: {
    ttt,
    PageChange,
    PersonDetail,
    PayVorcher,
    PayPlan,
    HeadTab
  },
  filters: {
    formateDate (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes())
    },
    formateDate2 (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
    },
    chinese (data) {
      if (data === 1) return '一'
      if (data === 3) return '三'
    },
    statusFilter (data) {
      if (data === 1) return '审核中'
      if (data === 2) return '待分期'
      if (data === 3) return '已分期'
      if (data === 4) return '退保中'
      if (data === 5) return '已退保'
    },
    // 保留小数点后两位
    fixedTwo (data) {
      if (data.toString().indexOf('.') !== -1) {
        if (data.toString().split('.')[1].length > 2) return data.toFixed(2)
        if (data.toString().split('.')[1].length <= 2) return data
      } else {
        return data
      }
    }
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
.home-table {
  padding: 0 0 70px;
  height: 100%;
  background: #f6f6f6;
  min-width: 1450px;
  box-sizing: border-box;
  width: 100%;
  font-size: 14px;
  overflow: hidden;
  margin: 0 auto;
  .r {
    background: #fff;
    .title {
      height: 40px;
      background: #62ACFF;
      color: #fff;
      font-size: 18px;
      line-height: 40px;
      span {
        padding-left: 10px;
        height: 18px;
        border-left: 3px solid #fff;
        margin-left: 20px;
      }
    }
  }
  .right {
    width: 400px;
    min-height: 802px;
    margin-top: 20px;
    margin-left: 20px;
    float: left;
    .message {
      position: relative;
      height: 622px;
      .page {
        position: absolute;
        bottom: 20px;
        // left: 10px;
        width: 100%;
      }
      .message_t {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #f2f2f2;
        .m_t {
          float: left;
          width: 30%;
          line-height: 48px;
          margin: 0 10%;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          &.active {
            border-bottom: 2px solid #82BEFF;
          }
        }
      }
      .message_c {
        padding: 0 20px;
        height: 590px;
        overflow: hidden;
        a {
          cursor: pointer;
        }
        .checkbox {
          float: left;
          width: 14px;
          height: 14px;
          border: 1px solid #e2e2e2;
          border-radius: 50%;
          margin-top: 12px;
          margin-right: 10px;
          cursor: pointer;
          background: #fff;
          position: relative;
          input {
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            opacity: 0;
            z-index: 99;
            cursor: pointer;
          }
          img {
            display: none;
            width: 16px;
            height: 16px;
          }
        }
        .mark {
          line-height: 40px;
          a {
            border: 1px solid #62ACFF;
            padding: 2px 4px;
            float: right;
            line-height: 20px;
            margin-top: 3px;
          }
        }
        .figure {
          border-bottom: 1px solid #eee;
          padding-top: 10px;
          overflow: hidden;
          .text_show {
            float: left;
            line-height: 40px;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .delete {
            float: right;
            line-height: 80px;
            &:hover{
              color: red;
            }
          }
        }
      }
    }
  }
  .left {
    float: left;
    width: 1120px;
    margin-left: 20px;
    margin-top: 20px;
    min-height: 620px;
    .top {
      margin-bottom: 20px;
      height: 391px;
      overflow: hidden;
      position: relative;
      .table_page {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
    .bottom {
      height: 391px;
      position: relative;
      overflow: hidden;
      .table_page {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
  }
  .pay_detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background: #00000050;
    cursor: pointer;
    .detail_table {
      width: 770px;
      background: #fff;
      position: absolute;
      cursor: default;
      // border: 1px solid #eeeeee;
      left: 50%;
      margin: 100px 0 0 -385px;
      &.det {
        max-height: 500px;
        min-height: 200px;
        overflow-y: scroll;
        text-align: center;
        span {
          line-height: 200px;
          font-size: 30px;
        }
      }
      img {
        width: 100%;
        display: block;
      }
      .head{
        height: 40px;
        line-height: 40px;
        background: #2e92ff;
        color: #fff;
        p {
          float: left;
          line-height: 40px;
          font-size: 16px;
          padding: 0 30px 0 20px;
        }
        .h {
          float: right;
          font-size: 14px;
          line-height: 40px;
          span {
            margin-right: 20px;
            font-size: 12px;
            line-height: 40px;
            display: inline-block;
          }
          i{
            padding: 0 10px;
            line-height: 22px;
            color: #2e92ff;
            margin-right: 30px;
            background: #fff;
            border-radius: 20px;
          }
        }
      }
      table {
        border-collapse: collapse;
        width: 100%;
        font-size: 16px;
        margin: 20px 0;
        th {
          padding-top: 5px;
          line-height: 40px;
          font-size: 16px;
          td {
            width: 192px;
          }
        }
        tr {
          height: 48px;
          line-height: 48px;
          td:nth-of-type(1) {
            width: 140px;
            text-align: right;
          }
          td:nth-of-type(2) {
            div {
              width: 570px;
              height: 30px;
              line-height: 30px;
              border: 1px solid #ccc;
              margin: 8px 18px;
              text-indent: 20px;
              border-radius: 3px;
            }
          }
        }
      }
      .stages {
        max-height: 600px;
        overflow-y: scroll;
        padding: 20px 0;
        ul {
          float: left;
          width: 25%;
          text-align: center;
          li {
            line-height: 40px;
            font-size: 14px;
            &:first-of-type {
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
.payment_plan {
  width: 770px;
  height: 500px;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  cursor: default;
  h2 {
    height: 40px;
    line-height: 40px;
    background: #2e92ff;
    color: #fff;
    font-size: 18px;
    text-indent: 20px;
  }
  p {
    font-size: 12px;
    line-height: 50px;
    text-indent: 12px;
    color: #666;
  }
  .con {
    text-align: center;
    p {
      font-size: 16px;
      color: #666;
      text-align: left;
      text-indent: 190px;
    }
    .up_pdf {
      width: 240px;
      height: 130px;
      border: 1px solid #ccc;
      margin: 0 auto;
      border-radius: 4px;
      position: relative;
      background-image: url(../../assets/upload_pdf.png);
      background-size: contain;
      background-position: center center;
      input {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
  .btn {
    button {
      width: 85px;
      height: 40px;
      border: 0;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #2e92ff;
      font-size: 16px;
      color: #2e92ff;
      margin-top: 20px;
      cursor: pointer;
      outline: none;
      &:first-of-type {
        margin-right: 170px;
      }
      &:last-of-type {
        background: #2e92ff;
        color: #fff;
      }
    }
  }
}
#upoad_payment_voucher {
  .up_pdf {
    margin-top: 105px;
    background-image: url(../../assets/upload.png);
  }
  span {
    font-size: 12px;
    color:#2e92ff;
    line-height: 40px;
  }
  .btn {
    margin-top: 100px;
  }
}
</style>
