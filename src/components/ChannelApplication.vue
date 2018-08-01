<template>
  <div class="channel-application">
    <h2>渠道代理申请</h2>
    <div class="a_body">
      <div class="basic_msg">
        <div class="basic_m">
          <div class="tit">填写基本信息</div>
          <div class="w" id="writeMsg">
            <div class="r">
              <span><i>*</i> 企业名称：</span><input type="text" placeholder="请输入企业名称" v-model="cName">
            </div>
            <div class="r">
              <span><i>*</i> 负责人姓名：</span><input type="text" placeholder="请输入法人姓名" v-model="fName">
            </div>
            <div class="r">
              <span><i>*</i> 联系方式：</span><input type="text" placeholder="请输入联系方式" v-model="phone" @blur="blur">
            </div>
            <div class="r">
              <span><i>*</i> 经营地址：</span><input type="text" placeholder="请输入经营地址" v-model="address">
            </div>
          </div>
        </div>
      </div>
      <div class="basic_img">
        <div class="img_in">
          <div class="tit">上传照片</div>
          <div class="w">
            <div class="pic">
              <div>营业执照：</div>
              <div class="img" :style="imgChange0">
                <input type="file" @change="fileImage($event, 1)" accept="image/jpeg,image/x-png,image/gif">
              </div>
            </div>
            <div class="pic">
              <div>代理商合作协议：</div>
              <div class="img" :style="imgChange1">
                <input type="file" @change="filePdf($event, 2)" accept=".pdf">
                <div class="pdf_name">{{pdfName}}</div>
                <span>请先下载代理合作协议，签字后以PDF格式上传</span>
              </div>
              <a class="download" :href="url + Data.url" target="_blank">下载</a>
            </div>
            <div class="pic">
              <div>法人身份证正面：</div>
              <div class="img" :style="imgChange2">
                <input type="file" @change="fileImage($event, 3)" accept="image/jpeg,image/x-png,image/gif">
                <span>请上传身份证正面</span>
              </div>
            </div>
            <div class="pic">
              <div>法人身份证反面：</div>
              <div class="img" :style="imgChange3">
                <input type="file" @change="fileImage($event, 4)" accept="image/jpeg,image/x-png,image/gif">
                <span>请上传身份证反面</span>
              </div>
            </div>
          </div>
          <button @click="nextPage">下一步</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import url from '../assets/Req.js'
export default {
  name: 'ChannelApplication',
  data () {
    return {
      cName: '',
      fName: '',
      phone: '',
      address: '',
      imgChange0: {},
      imgChange1: {},
      imgChange2: {},
      imgChange3: {},
      file: '',
      arr: [],
      url: url,
      pdfName: '',
      Data: ''
    }
  },
  mounted () {
    this.$http.get(url + 'admin/getByTime').then(res => {
      // console.log(res.data)
      this.Data = res.data.data
    })
  },
  methods: {
    // 失去焦点
    blur (e) {
      // console.log(e)
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(e.target.value)) {
        e.target.style.borderColor = 'red'
        this.$message({
          type: 'info',
          message: '您输入的手机号格式不正确，请重新输入'
        })
      } else {
        e.target.style.borderColor = '#ccc'
      }
    },
    // 改变颜色
    changeColor (index) {
      var write = document.getElementById('writeMsg').children
      for (var i = 0; i < write.length; i++) {
        write[i].children[1].style.borderColor = '#ccc'
      }
      if (index < write.length) {
        write[index].children[1].style.borderColor = 'red'
      }
    },
    nextPage () {
      if (this.cName === '') {
        this.changeColor(0)
      } else if (this.fName === '') {
        this.changeColor(1)
      } else if (this.phone === '') {
        this.changeColor(2)
      } else if (this.address === '') {
        this.changeColor(3)
      } else if (this.arr[0] === undefined) {
        this.changeColor(4)
        alert('请上传营业执照')
      } else if (this.arr[1] === undefined) {
        this.changeColor(4)
        alert('请上传代理商合作协议')
      } else if (this.arr[2] === undefined) {
        this.changeColor(4)
        alert('请上传法人身份证')
      } else {
        // 判断是否为正确的手机号格式
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(this.phone)) {
          this.changeColor(2)
          alert('您输入的手机号不正确')
        } else {
          let that = this
          var formData = new FormData()
          formData.append('enterpriseName', this.cName)
          formData.append('headName', this.fName)
          formData.append('phone', this.phone)
          formData.append('address', this.address)
          for (var i = 0; i < this.arr.length - 1; i++) {
            for (var j = 0; j < this.arr.length - 1 - i; j++) {
              if (this.arr[j].id > this.arr[j + 1].id) {
                var temp = this.arr[j]
                this.arr[j] = this.arr[j + 1]
                this.arr[j + 1] = temp
              }
            }
          }
          this.arr.map(v => {
            formData.append('file', v.file)
          })
          // console.log(this.arr)
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          that.$http.post(url + 'channel/insert', formData, config).then(res => {
            // console.log(res.data.msg)
            if (res.data.msg === 'success') {
              this.$router.push('/Condition')
            } else {
              this.$message({
                type: 'info',
                message: res.data.msg
              })
            }
          })
        }
      }
    },
    filePdf (e, i) {
      var filepdf = e.target.files[0]
      if (filepdf.name.split('.')[1] === 'pdf') {
        var imgSize = filepdf.size / 1024
        if (imgSize > 3 * 1024) {
          this.$message({
            type: 'info',
            message: '请上传大小不要超过3M的文件'
          })
        } else {
          this.pdfName = filepdf.name
          this.arr.push({'id': i, 'file': filepdf})
          this.imgChange1 = {
            'background': '#fff'
          }
        }
      } else {
        this.$message({
          type: 'info',
          message: '请上传pdf格式的文件'
        })
      }
    },
    fileImage (e, i) {
      var that = this
      var file = e.target.files[0]
      if (file.name.split('.')[1] !== 'png' && file.name.split('.')[1] !== 'gif' && file.name.split('.')[1] !== 'jpg' && file.name.split('.')[1] !== 'jpeg' && file.name.split('.')[1] !== 'bmp' && file.name.split('.')[1] !== 'pdf') {
        this.$message({
          type: 'info',
          message: '请上传图片'
        })
      } else {
        this.arr.push({'id': i, 'file': file})
        var imgSize = file.size / 1024
        if (imgSize > 3 * 1024) {
          this.$message({
            type: 'info',
            message: '请上传大小不要超过3M的图片'
          })
        } else {
          var reader = new FileReader()
          reader.readAsDataURL(file) // 读出 base64
          reader.onloadend = function () {
            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
            var dataURL = reader.result
            var avatar = dataURL
            // console.log(i)
            if (i === 1) {
              that.imgChange0 = {
                'background-image': 'url(' + avatar + ')'
              }
            } else if (i === 3) {
              that.imgChange2 = {
                'background-image': 'url(' + avatar + ')'
              }
            } else {
              that.imgChange3 = {
                'background-image': 'url(' + avatar + ')'
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-application {
  font-size: 16px;
  h2 {
    text-align: left;
    height: 60px;
    background: #2E92FF;
    font-size: 18px;
    color: #fff;
    line-height: 60px;
    font-weight: normal;
    padding-left: 40px;
  }
  .tit{
    text-align: left;
    width: 1050px;
    margin: 0 auto 42px;
    font-size: 18px;
    height: 22px;
    line-height: 22px;
    border-left: 2px solid #2e92ff;
    padding-left: 13px;
  }
  .a_body {
    background: #f2f2f2;
    .basic_msg {
      background: #f2f2f2;
      padding: 20px;
      .basic_m {
        width: 100%;
        min-width: 1100px;
        background: #fff;
        padding-top: 73px;
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
            input {
              width: 920px;
              height: 30px;
              border: 0;
              border:1px solid #ccc;
              border-radius: 3px;
              text-indent: 6px;
              &:hover {
                border-color: #bed6ff;
              }
            }
          }
        }
      }
    }
    .basic_img {
      background: #f2f2f2;
      padding: 0 20px 20px;
      .img_in {
        width: 100%;
        min-width: 1100px;
        background: #fff;
        padding-top: 54px;
        text-align: center;
        padding-bottom: 100px;
        .w {
          width: 1050px;
          margin: 40px auto 0;
          overflow: hidden;
          .pic {
            float: left;
            overflow: hidden;
            margin-bottom: 45px;
            padding-bottom: 30px;
            position: relative;
            &:nth-of-type(2) {
              .img {
                background-image: url(../assets/upload_pdf.png);
              }
            }
            &:nth-child(2n+1) {
              margin-right: 200px;
            }
            div {
              width: 130px;
              text-align: right;
              float: left;
            }
            .img {
              width: 240px;
              height: 130px;
              border: 1px solid #ccc;
              text-align: center;
              position: relative;
              background-repeat: no-repeat;
              background-position: center center;
              border-radius: 3px;
              background-size: 240px 130px;
              background-image: url(../assets/upload.png);
              span {
                font-size: 12px;
                color: #2e92ff;
                position: absolute;
                bottom: -30px;
                width: 100%;
                left: 0;
                white-space: nowrap;
              }
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
            .download {
              margin-left: 20px;
              position: relative;
              bottom: -90px;
            }
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
        }
      }
    }
  }
}
</style>
