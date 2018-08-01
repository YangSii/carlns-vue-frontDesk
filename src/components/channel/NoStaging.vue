<template>
  <div class="no-staging">
    <HeadTab :numtab="2" />
    <div class="already">
      <div class="header">
        <div class="title"><span>待分期列表</span></div>
      </div>
      <table>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td><span>{{ index + 1 }}</span></td>
            <td v-if="item.logtab === 1">企业名称：{{ item.name }}</td>
            <td v-if="item.logtab === 2">姓名：{{ item.name }}</td>
            <td v-if="item.licenseNumber">车牌号：{{ item.licenseNumber }}</td>
            <td v-if="item.certification">车架号：{{ item.certification }}</td>
            <td>分期金额：{{ item.businessRisks + item.insuranceRisks + item.transport | fixedTwo}}</td>
            <td>分期期数：{{ item.monNubmer }}</td>
            <td style="color: orange;">状态：{{ item.status | statusFilter }}</td>
            <td>时间：{{ item.datetime | formateDate }}</td>
            <td>
              <a @click="check(item.id, item.logtab)" style="color:#666;">查看详情</a>
              <a @click="plan(item.id)" v-if="item.logtab === 1">上传付款计划表</a>
              <a @click="plan1(item.id)" v-if="item.logtab === 1">上传付款凭证</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分期详情 -->
    <PersonDetail v-if="detailShow" :tableData="checkDetailData" @PersonDetail="PersonDetail" />
    <!-- 上传付款计划表 -->
    <PayPlan v-if="uploadPayPlan" @PayPlan="PayPlan" :id="uploadId"/>
    <!-- 上传付款凭证 -->
    <PayVorcher v-if="uploadPay" @PayVorcher="PayVorcher" :id="uploadId" />
  </div>
</template>

<script>
import HeadTab from '../common/HeadTab'
import PersonDetail from '../alert/PersonDetail'
import PayVorcher from '../alert/PayVorcher'
import PayPlan from '../alert/PayPlan'
import url from '../../assets/Req.js'
export default {
  name: 'NoStaging',
  data () {
    return {
      data: [],
      title: ['序号', '姓名', '车牌号', '合格证', '分期金额', '分期期数', '付款计划表', '时间', '状态', '操作'],
      drive: '',
      fName: '',
      phone: '',
      detailShow: false,
      id: '',
      imgChange0: {},
      imgChange1: {},
      imgChange2: {},
      arr: [],
      isCheck: false,
      checkDetailData: {},
      aaa: false,
      uploadPayPlan: false,
      uploadPay: false,
      uploadId: 0
    }
  },
  mounted () {
    this.getData()
    // this.getInfoData()
  },
  methods: {
    plan (id) {
      this.uploadId = id
      this.uploadPayPlan = true
    },
    plan1 (id) {
      this.uploadId = id
      this.uploadPay = true
    },
    PayPlan () {
      this.uploadPayPlan = false
    },
    PayVorcher () {
      this.uploadPay = false
    },
    PersonDetail (data) {
      this.detailShow = false
    },
    check (data, status) {
      this.id = data
      // let that = this
      if (status === 1) {
        this.$router.push({name: 'Detail', query: {id: data, logtab: status, tab: 2}})
      } else {
        // 跳转到待分期信息页面
        this.$router.push({name: 'Individual', query: {id: data, logtab: status}})
      }
    },
    uploadImg () {
      var formData = new FormData()
      formData.append('file', this.arr[0].file)
      formData.append('id', this.id)
      formData.append('token', sessionStorage.getItem('userId'))
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      let that = this
      that.$http.post(url + 'enterprise/ScheduleByImage', formData, config).then(res => {
        // console.log(res)
        this.detailShow = false
        this.getData()
      })
    },
    uploadImage (data) {
      this.detailShow = true
      this.id = data
    },
    close (e) {
      if (e.target === document.getElementById('close')) {
        this.detailShow = false
      }
      if (e.target === document.getElementById('check')) {
        this.isCheck = false
      }
    },
    getData () {
      let that = this
      that.$http.get(url + 'common/getList', {
        params: {
          status: '2',
          token: sessionStorage.getItem('userId'),
          page: '1',
          row: '6'
        }
      }).then(res => {
        // console.log(res.data)
        this.data = res.data.data
      })
    },
    // 获取图片
    fileImage (e, i) {
      var that = this
      var file = e.target.files[0]
      this.arr.push({'id': i, 'file': file})
      // console.log(this.arr)
      var imgSize = file.size / 1024
      if (imgSize > 200) {
        alert('请上传大小不要超过200KB的图片')
      } else {
        var reader = new FileReader()
        reader.readAsDataURL(file) // 读出 base64
        reader.onloadend = function () {
          // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
          var dataURL = reader.result
          var avatar = dataURL
          if (i === 1) {
            that.imgChange0 = {
              'background-image': 'url(' + avatar + ')'
            }
          } else if (i === 2) {
            that.imgChange1 = {
              'background-image': 'url(' + avatar + ')'
            }
          } else if (i === 3) {
            that.imgChange2 = {
              'background-image': 'url(' + avatar + ')'
            }
          }
        }
      }
    }
  },
  filters: {
    formateDate (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
    },
    statusFilter (data) {
      if (data === 1) return '审核中'
      if (data === 2) return '待分期'
      if (data === 3) return '已分期'
      if (data === 4) return '退保中'
      if (data === 5) return '已退保'
    },
    formateDate2 (data) {
      let date = new Date(data)
      return date.getFullYear() + '.' + addZero(date.getMonth() + 1) + '.' + addZero(date.getDate())
    },
    chinese (data) {
      if (data === 1) return '一'
      if (data === 3) return '三'
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
  },
  components: {
    PersonDetail,
    PayVorcher,
    PayPlan,
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
.no-staging {
  // padding-top: 10px;
  .already {
    width: 100%;
    background: #fff;
    .header {
      height: 60px;
      line-height: 60px;
      background: #eaf4ff;
      .title{
        float: left;
        text-align: left;
        font-size: 18px;
        padding-left: 20px;
        span {
          padding-left: 20px;
          border-left: 2px solid blue;
        }
      }
      button {
        cursor: pointer;
        border: 0;
        color: #fff;
        background: rgba(46, 146, 255, 1);
        padding: 5px;
        float: right;
        margin: 15px 30px 0 0;
        border-radius: 3px;
      }
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: center;
      tr {
        td:nth-of-type(2) {
          width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      tbody {
        tr {
          height: 50px;
          td {
            border-bottom: 2px solid #f6f6f6;
            text-align: left;
            &:first-of-type {
              width: 80px;
              text-align: center;
              span {
                display: inline-block;
                width: 30px;
                line-height: 30px;
                background: #f2f8ff;
              }
            }
          }
          td:nth-of-type(7) {
            cursor: pointer;
          }
          td:last-of-type {
            cursor: pointer;
            text-align: center;
            a {
              border: 1px solid #00a2ff;
              padding: 5px;
            }
          }
        }
      }
    }
  }
  .upload {
    position: fixed;
    font-size: 16px;
    width: 100%;
    height: 100%;
    background: #00000060;
    top: 0;
    left: 0;
    cursor: pointer;
    .uploadbox {
      width: 770px;
      background: #fff;
      position: absolute;
      cursor: default;
      // border: 1px solid #eeeeee;
      left: 50%;
      margin: 100px 0 0 -385px;
      .pic {
        float: left;
        overflow: hidden;
        margin: 10px 20px 75px 20px;
        .picShadule {
          font-size: 16px;
          line-height: 40px;
        }
        .img {
          width: 230px;
          height: 130px;
          border: 1px solid #ccc;
          text-align: center;
          position: relative;
          background-repeat: no-repeat;
          background-position: center center;
          border-radius: 3px;
          background-size: 240px 130px;
          background-image: url(../../assets/upload.png);
          input {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      button {
        cursor: pointer;
        width: 100px;
        height: 30px;
        background: #00a2ff;
        color: #fff;
        border: 0;
        font-size: 16px;
        border-radius: 4px;
        outline: none;
        margin: 10px 20px;
      }
      .see {
        max-height: 500px;
        min-height: 300px;
        overflow-y: scroll;
        padding: 20px 0 0;
      }
      header {
        line-height: 40px;
        background: #2e92ff;
        padding-left: 40px;
        font-weight: bold;
        color: #fff;
      }
      .li {
        overflow: hidden;
        line-height: 40px;
        .tit {
          float: left;
          width: 140px;
          text-align: right;
          padding-right: 20px;
        }
        .con {
          float: left;
          width: 570px;
          height: 30px;
          line-height: 30px;
          border: 1px solid #ccc;
          margin: 8px 18px;
          text-indent: 20px;
          border-radius: 3px;
        }
        .img {
          float: left;
          width: 570px;
          margin: 8px 18px;
          img {
            width: 570px;
          }
        }
      }
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
</style>
