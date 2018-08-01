<template>
  <div class="person_detail">
    <!-- 分期详情 -->
    <div class="pay_detail"  id="close" @click="close($event)">
      <div class="detail_table">
        <div class="head">
          <p>分期详情</p>
          <span v-for="(item, index) in tableData.data" :key="index">
            {{ item.kind }}{{ item.data }}&nbsp;&nbsp;&nbsp;
          </span>
          <div class="h">
            <i>{{ tableData.year | chinese }}年期</i>
          </div>
        </div>
        <div class="stages">
          <ul>
            <li>期数</li>
            <li v-for="(data, index) in data" :key="index">{{data.periods}}</li>
          </ul>
          <ul>
            <li>还款时间</li>
            <li v-for="(data, index) in data" :key="index">{{data.rtime | formateDate2}}</li>
          </ul>
          <ul>
            <li>还款金额</li>
            <li v-for="(data, index) in data" :key="index">{{data.rmoney}}</li>
          </ul>
          <ul>
            <li>还款状态</li>
            <li v-for="(data, index) in data" :key="index">{{data.status | statusFilter}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import url from '../../assets/Req.js'
export default {
  name: 'PersonDetail',
  data () {
    return {
      data: []
    }
  },
  mounted () {
  },
  watch: {
    tableData () {
      // console.log(this.tableData)
      this.$http.get(url + 'stages/getStageDetails', {
        params: {
          token: sessionStorage.getItem('userId'),
          id: this.tableData.id
        }
      }).then(res => {
        console.log(res.data)
        this.data = res.data.data
      })
    }
  },
  methods: {
    // 关闭弹窗
    close (e) {
      if (e.target === document.getElementById('close')) {
        // this.detailShow = false
        this.$emit('PersonDetail', false)
      }
    }
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
      if (data === 1) return '待还款'
      if (data === 2) return '已还款'
      if (data === 3) return '已逾期'
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
  props: {
    tableData: {
      type: Object,
      default () {
        return {}
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
.person_detail {
  .pay_detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background: rgba(0, 0, 0, 0.5);
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
</style>
