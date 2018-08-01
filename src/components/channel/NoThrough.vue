<template>
  <div class="no_through">
    <HeadTab :numtab="4" />
    <div class="already">
      <div class="header">
        <div class="title"><span>未通过</span></div>
        <!-- <button>批量导出</button> -->
      </div>
      <table>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td><span>{{ index + 1 }}</span></td>
            <td v-if="item.logtab === 1">企业名称：{{ item.name }}</td>
            <td v-if="item.logtab === 2">姓名：{{ item.name }}</td>
            <td>车牌号：{{ item.licenseNumber }}</td>
            <td>车架号：{{ item.certification }}</td>
            <td>分期金额：{{ item.businessRisks + item.insuranceRisks + item.transport | fixedTwo}}</td>
            <td>分期期数：{{ item.monNubmer }}</td>
            <td>状态：{{ item.status | statusFilter }}</td>
            <td>时间：{{ item.datetime | formateDate }}</td>
            <td>
              <a @click="check(item.id, item.logtab)">查看详情</a>
            </td>
          </tr>
        </tbody>
      </table>
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
  name: 'NoThrough',
  data () {
    return {
      data: [],
      isCheck: false,
      checkDetailData: {},
      id: '',
      aaa: false,
      detailShow: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    PersonDetail (data) {
      this.detailShow = false
    },
    check (data, status) {
      if (status === 1) {
        this.$router.push({name: 'Detail', query: {id: data, logtab: status, tab: 4}})
      } else {
        this.$router.push({name: 'PDetail', query: {id: data, logtab: status, tab: 4}})
        // let that = this
        // this.detailShow = true
        // that.$http.get(url + 'personal/getPersonalByid', {
        //   params: {
        //     id: data,
        //     token: sessionStorage.getItem('userId')
        //   }
        // }).then(res => {
        //   console.log(res.data)
        //   this.aaa = false
        //   this.checkDetailData = {
        //     'year': res.data.data.yearsNubmer,
        //     'mon': res.data.data.monNubmer,
        //     'money': res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport,
        //     'date': res.data.data.createTime,
        //     'status': Number(res.data.data.scheduleImage),
        //     'status1': res.data.data.monNubmer - Number(res.data.data.scheduleImage),
        //     'data': [
        //       {'kind': '姓名：', 'data': res.data.data.userName},
        //       {'kind': '车牌号：', 'data': res.data.data.licenseNumber},
        //       {'kind': '分期金额：', 'data': res.data.data.businessRisks + res.data.data.insuranceRisks + res.data.data.transport},
        //       {'kind': '分期期数：', 'data': res.data.data.monNubmer}
        //     ]
        //   }
        //   if (res.data.data.certification) {
        //     this.checkDetailData.data[1].data = res.data.data.certification
        //     this.checkDetailData.data[1].kind = '车架号：'
        //   } else {
        //     this.checkDetailData.data[1].data = res.data.data.licenseNumber
        //     this.checkDetailData.data[1].kind = '车牌号：'
        //   }
        // })
      }
    },
    close (e) {
    },
    getData () {
      let that = this
      that.$http.get(url + 'common/getList?status=7&token=' + sessionStorage.getItem('userId')).then(res => {
        // console.log(res.data)
        this.data = res.data.data
      })
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
      if (data === 7) return '审核未通过'
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
    HeadTab,
    PersonDetail
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
.no_through {
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
            color: orange;
            cursor: pointer;
          }
          td:last-of-type {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
