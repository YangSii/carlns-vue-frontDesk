<template>
  <div class="ttt">
    <table>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td><div class="i">{{ index + 1 }}</div></td>
          <td v-if="item.logtab === 2">姓名：{{ item.name }}</td>
          <td v-if="item.logtab === 1">企业：{{ item.name }}</td>
          <td v-if="item.licenseNumber">车牌号：{{ item.licenseNumber }}</td>
          <td v-if="!item.licenseNumber">车架号：{{ item.certification }}</td>
          <td>分期金额：
            <span style="color:#2e92ff;">{{ item.businessRisks + item.insuranceRisks + item.transport | fixedTwo}}</span>
          </td>
          <td>分期期数：
            <span style="color:#2e92ff;">{{ item.monNubmer }}</span>
          </td>
          <td>状态：
            <span style="color:#2e92ff;">{{ item.status | statusFilter }}</span>
          </td>
          <td>时间：{{ item.datetime | formateDate }}</td>
          <td>
            <!-- <button class="f paytable" @click="shadule(item.id)" v-show="item.logtab === 1" v-if="pay">付款计划表</button>
            <button class="f paytable" @click="shadule(item.id)" v-show="item.logtab === 1">企业分期详情</button> -->
            <button class="f paytable" @click="$emit('tableDetail', [item.id, item.logtab])" v-show="item.logtab === 2">查看详情</button>
            <button class="f pay" @click="$router.push({path: '/ConfirmPolicy', query: {id: item.id, logtab: item.logtab}})" v-show="item.logtab === 2" v-if="pay">付款</button>
            <button class="f paytable" @click="$router.push({path: '/Detail', query: {id: item.id, logtab: item.logtab, tab: 0}})" v-show="item.logtab === 1" v-if="!pay">查看详情</button>
            <button class="f paytable" @click="$emit('uploadPaymentPlan', [item.id, item.logtab])" v-show="item.logtab === 1" v-if="pay">上传付款计划表</button>
            <button class="f paytable" @click="$emit('uploadPaymentVoucher', [item.id, item.logtab])" v-show="item.logtab === 1" v-if="pay">上传付款凭证</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import url from '../../assets/Req.js'
import { Button } from 'mint-ui'
export default {
  name: 'ttt',
  data () {
    return {
    }
  },
  methods: {
    shadule (data) {
      let that = this
      that.$http.get(url + 'enterprise/ScheduleImage', {
        params: {
          id: data,
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data.data[0].pScheduleImage)
        this.$emit('tableListDetail', res.data.data[0].pScheduleImage)
      })
    }
  },
  filters: {
    formateDate (data) {
      if (!data) return '时间！'
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
    Button
  },
  props: {
    pay: {
      type: Boolean,
      default () {
        return false
      }
    },
    data: {
      type: Array,
      default () {
        return []
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
.ttt {
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    text-align: left;
    // height: 251px;
    // overflow: hidden;
    tbody {
      tr {
        height: 50px;
        td {
          border-bottom: #f2f2f2 1px solid;
          &:nth-of-type(1) {
            text-align: center;
            .i {
              display: inline-block;
              width: 30px;
              height: 30px;
              background: #f2f2f2;
              text-align: center;
              line-height: 30px;
            }
          }
          &:nth-of-type(2) {
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &:last-of-type {
            text-align: center;
            // width: 200px;
            // padding-right: 20px;
            .f {
              border: 0;
              height: 30px;
              background: #fff;
              // border-radius: 5px;
              border: 1px solid #a9cdff;
              outline: none;
              cursor: pointer;
              color: #2e92ff;
            }
            .paytable {
              padding: 0 4px;
            }
            .pay {
              padding: 0 15px;
              // background: #a9cdff;
              // color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
