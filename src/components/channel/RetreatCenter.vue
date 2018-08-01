<template>
  <div class="RetreatCenter">
    <HeadTab :numtab="5" />
    <div class="already">
      <div class="header">
        <div class="title"><span>退保中心</span></div>
        <!-- <button>批量导出</button> -->
      </div>
      <table>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td><span>{{ index + 1 }}</span></td>
            <td v-if="item.logtab === 1">企业名称：{{ item.name }}</td>
            <td v-if="item.logtab === 2">姓名：{{ item.name }}</td>
            <td v-if="item.licenseNumber">车牌号：{{ item.licenseNumber }}</td>
            <td v-if="item.certification">车架号：{{ item.certification }}</td>
            <td>分期金额：{{ item.businessRisks + item.insuranceRisks + item.transport }}</td>
            <td>分期期数：{{ item.monNubmer }}</td>
            <td style="color: orange;">状态：{{ item.status | statusFilter }}</td>
            <td>时间：{{ item.datetime | formateDate }}</td>
            <td>
              <a @click="check(item.id, item.logtab)">查看详情</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import HeadTab from '../common/HeadTab'
import url from '../../assets/Req.js'
export default {
  name: 'RetreatCenter',
  data () {
    return {
      data: [],
      isCheck: false,
      checkDetailData: {},
      id: '',
      aaa: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    check (data, status) {
      if (status === 1) {
        this.$router.push({name: 'Detail', query: {id: data, logtab: status, tab: 5}})
      } else {
        this.$router.push({name: 'AlerdyDetail', query: {id: data, logtab: status, exit: 5}})
      }
    },
    close (e) {
    },
    getData () {
      let that = this
      that.$http.get(url + 'common/getList?status=4&token=' + sessionStorage.getItem('userId')).then(res => {
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
      if (data === 6) return '待确认分期'
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
.RetreatCenter {
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
          td:nth-of-type(6) {
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
