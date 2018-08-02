<template>
  <div class="pay_plan">
    <!-- 上传付款计划表 -->
    <div class="pay_detail"  id="uplaod_payment_plan" @click="close($event)">
      <div class="payment_plan">
        <h2>上传付款计划表</h2>
        <p>请先下载付款计划表PDF文件，然后打印盖章后点击上传</p>
        <div class="con">
          <p>1、《付款计划表》<a :href="url + Url" target="_blank">下载</a></p>
          <p>2、上传盖章或签名后的PDF付款计划表</p>
          <div class="up_pdf" :style="imgChange1">
            <!-- {{name}} -->
            <input type="file" @change="uploadFile($event)" accept=".pdf">
          </div>
          <div class="btn">
            <button @click="$emit('PayPlan', false)">取消</button>
            <button @click="upload">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import url from '../../assets/Req.js'
export default {
  name: 'PayPlan',
  data () {
    return {
      url: url,
      name: '',
      file: '',
      imgChange1: '',
      Url: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      // http://192.168.1.110:80/common/pdfDownload?token=18925d61-f039-4104-9ac0-a9b6c4129eba&id=51
      this.$http.get(url + 'common/pdfDownload', {
        params: {
          token: sessionStorage.getItem('userId'),
          id: this.id
        }
      }).then(res => {
        this.Url = res.data.data
      })
    },
    close (e) {
      if (e.target === document.getElementById('uplaod_payment_plan')) {
        this.$emit('PayPlan', false)
      }
    },
    uploadFile (e) {
      var filepdf = e.target.files[0]
      if (filepdf.name.split('.')[1] === 'pdf') {
        var imgSize = filepdf.size / 1024
        if (imgSize > 3 * 1024) {
          this.$message({
            type: 'info',
            message: '请上传大小不要超过3M的文件'
          })
        } else {
          this.file = e.target.files[0]
          this.name = this.file.name
          this.imgChange1 = {
            'background-image': 'url(/static/img/pdf.png)'
          }
        }
      } else {
        this.$message({
          type: 'info',
          message: '请上传pdf格式的文件'
        })
      }
    },
    upload () {
      var formData = new FormData()
      formData.append('file', this.file)
      formData.append('id', this.id)
      formData.append('token', sessionStorage.getItem('userId'))
      let that = this
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      that.$http.post(url + 'common/uploadPaymentPlan', formData, config).then(res => {
        // console.log(res.data)
        if (res.data.code === 200) {
          this.$emit('PayPlan', false)
        } else {
          alert(res.data.msg)
        }
      })
    }
  },
  props: {
    id: {
      type: Number,
      default () {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pay_plan {
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
}
</style>
