<template>
  <div class="enter">
    <HeadTab :numtab="1" @refresh="refresh"/>
    <div class="first_enter" v-show="isShow" v-if="isShowV">
      <button class="active" @click="user('company')">企业客户入口</button>
      <button @click="user('personal')">个人客户入口</button>
    </div>
    <div class="enter_choose" v-show="!isShow" v-if="isShowV">
      <div class="basic_msg">
        <div class="basic_m">
          <div class="tit">填写基本信息</div>
          <div class="w" id="writeMsg">
            <div class="r" v-if="!isPerson">
              <span><i>*</i> 企业名称：</span><input type="text" placeholder="请输入企业名称" v-model="cName">
            </div>
            <div class="r" v-if="isPerson">
              <span><i>*</i> 姓名：</span><input type="text" placeholder="请输入姓名" v-model="pName">
            </div>
            <div class="r" v-if="!isPerson">
              <span><i>*</i> 法人姓名：</span><input type="text" placeholder="请输入法人姓名" v-model="fName">
            </div>
            <div class="r" v-if="isPerson">
              <span><i>*</i> 身份证号：</span><input type="text" placeholder="请输入身份证号" v-model="cId" @blur="blur($event, 'card')">
            </div>
            <div class="r">
              <span><i>*</i> 联系方式：</span><input onkeyup="value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" type="text" placeholder="请输入联系方式" v-model="phone" @blur="blur($event, 'phone')">
            </div>
            <div class="r">
              <span><input type="radio" name="car" @change="numberChange" value="车辆合格证" checked>车辆合格证：</span><input type="text" placeholder="请输入你的合格证/车牌号" v-model="pCertification">
            </div>
            <div class="r" style="color:#ccc;">
              <span><input type="radio" name="car" @change="numberChange" value="车牌号">车牌号：</span><input type="text" placeholder="请输入你的合格证/车牌号" v-model="pLicenseNumber" disabled>
            </div>
          </div>
        </div>
      </div>
      <div class="basic_msg" style="margin-top: 20px;">
        <div class="basic_m">
          <div class="tit">车辆投保</div>
          <div class="w" id="bussiness">
            <div class="r">
              <span><i>*</i> 商业险：</span><input onkeyup="value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" type="text" placeholder="请输入商业险金额" v-model="commercial">
            </div>
            <div class="r">
              <span>交强险：</span><input onkeyup="value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" type="text" placeholder="请输入交强险金额" v-model="strong">
            </div>
            <div class="r">
              <span>车船税：</span><input onkeyup="value = value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" type="text" placeholder="请输入车船税金额" v-model="vehicles">
            </div>
            <div class="r">
              <span>车险年限：</span>
              <!-- <select @change="yearNumber">
                <option>1</option>
                <option>3</option>
              </select> -->
              <input type="button" value="一年" @click="yearNumber($event, '1')">
              <input type="button" value="三年" @click="yearNumber($event, '3')">
            </div>
            <div class="r">
              <span>月付期期数：</span>
              <select @change="monthNumber">
                <option v-for="(data, index) in monArr" :key="index">{{data}}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="basic_img">
        <div class="img_in">
          <div class="tit">上传照片</div>
          <div class="w">
            <div class="pic">
              <div>缴费通知单：</div>
              <div class="img" :style="imgChange0">
                <input type="file" @change="fileImage($event, 1)" @click="test(1)" accept="image/jpeg,image/x-png,image/gif">
              </div>
            </div>
            <div class="pic" v-if="!isPerson">
              <div>营业执照：</div>
              <div class="img" :style="imgChange1">
                <input type="file" @change="fileImage($event, 2)" @click="test(2)" accept="image/jpeg,image/x-png,image/gif">
              </div>
            </div>
            <div class="pic" v-if="driving">
              <div>购车发票：</div>
              <div class="img" :style="imgChange2">
                <input type="file" @change="fileImage($event, 3)" @click="test(3)" accept="image/jpeg,image/x-png,image/gif">
              </div>
            </div>
            <div class="pic" v-if="!driving">
              <div>机动车行驶证：</div>
              <div class="img" :style="imgChange3">
                <input type="file" @change="fileImage($event, 4)" @click="test(4)" accept="image/jpeg,image/x-png,image/gif">
              </div>
            </div>
            <div class="pic">
              <div v-if="!isPerson">法人身份证(正)：</div>
              <div v-if="isPerson">身份证(正)：</div>
              <div class="img" :style="imgChange4">
                <input type="file" @change="fileImage($event, 5)" @click="test(5)" accept="image/jpeg,image/x-png,image/gif">
              </div>
            </div>
            <div class="pic">
              <div v-if="!isPerson">法人身份证(反)：</div>
              <div v-if="isPerson">身份证(反)：</div>
              <div class="img" :style="imgChange5">
                <input type="file" @change="fileImage($event, 6)" @click="test(6)" accept="image/jpeg,image/x-png,image/gif">
              </div>
            </div>
          </div>
          <button @click="nextPage">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTab from '../common/HeadTab'
import url from '../../assets/Req.js'
export default {
  name: 'Enter',
  data () {
    return {
      isCompany: false,
      isShow: true,
      isShowV: true,
      driving: true,
      imgChange0: {},
      imgChange1: {},
      imgChange2: {},
      imgChange3: {},
      imgChange4: {},
      imgChange5: {},
      status: 'personal',
      isPerson: true,
      cName: '',
      fName: '',
      phone: '',
      pCertification: '',
      pLicenseNumber: '',
      pName: '',
      cId: '',
      commercial: 0,
      strong: 0,
      vehicles: 0,
      pMonNubmer: 12,
      pYearNubmer: '1',
      arr: [],
      personData: [],
      numArr: [],
      monArr: ['12']
    }
  },
  mounted () {
    this.isShow = true
  },
  methods: {
    blur (e, data) {
      if (data === 'card') {
        var reg1 = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
        if (!reg1.test(e.target.value)) {
          e.target.style.borderColor = 'red'
          this.$message({
            type: 'info',
            message: '您输入的身份证号格式不正确，请重新输入'
          })
        } else {
          e.target.style.borderColor = '#dcdfe6'
        }
      } else {
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
      }
    },
    refresh () {
      this.isShow = true
    },
    changeColor (index, ele) {
      var write = document.getElementById(ele).children
      for (var i = 0; i < write.length; i++) {
        write[i].children[1].style.borderColor = '#ccc'
      }
      if (index < write.length) {
        write[index].children[1].style.borderColor = 'red'
      }
    },
    yearNumber (e, data) {
      this.pYearNubmer = data
      if (data === '1') {
        e.target.style.borderColor = 'rgb(46, 146, 255)'
        e.target.nextElementSibling.style.borderColor = '#ccc'
        this.monArr = ['12']
      } else {
        e.target.style.borderColor = 'rgb(46, 146, 255)'
        e.target.previousElementSibling.style.borderColor = '#ccc'
        this.monArr = ['12', '18', '24', '36']
      }
    },
    monthNumber (data) {
      // console.log(data.target.value)
      this.pMonNubmer = data.target.value
    },
    numberChange (data) {
      data.target.parentNode.nextSibling.disabled = false
      data.target.parentNode.style.color = '#000'
      if (data.target.value === '车辆合格证') {
        data.target.parentNode.parentNode.nextElementSibling.children[1].disabled = true
        this.driving = true
        data.target.parentNode.parentNode.nextElementSibling.children[0].style.color = '#ccc'
        this.pLicenseNumber = ''
      } else {
        data.target.parentNode.parentNode.previousElementSibling.children[1].disabled = true
        this.driving = false
        data.target.parentNode.parentNode.previousElementSibling.style.color = '#ccc'
        this.pCertification = ''
      }
    },
    getInfoData () {
      let that = this
      that.$http.get(url + 'personal/list', {
        params: {
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res)
        this.personData = res.data.data[0]
        // console.log(this.personData)
      })
    },
    user (data) {
      this.status = data
      this.isShow = false
      if (data === 'personal') {
        this.isPerson = true
      } else {
        this.isPerson = false
      }
    },
    // 上传数据
    nextPage () {
      if (this.status === 'company') {
        if (this.cName === '') {
          this.changeColor(0, 'writeMsg')
        } else if (this.fName === '') {
          this.changeColor(1, 'writeMsg')
        } else if (this.phone === '') {
          this.changeColor(2, 'writeMsg')
        } else if (this.commercial === '') {
          this.changeColor(0, 'bussiness')
        } else {
          if (this.arr.length < 5) {
            alert('请上传需要文件的图片')
          } else {
            var formData = new FormData()
            formData.append('enterpriseName', this.cName)
            formData.append('personName', this.fName)
            formData.append('pPhone', this.phone)
            formData.append('pBusinessRisks', this.commercial)
            formData.append('pInsuranceRisks', this.strong)
            formData.append('pTransport', this.vehicles)
            formData.append('pYearNubmer', this.pYearNubmer)
            formData.append('pMonNubmer', this.pMonNubmer)
            formData.append('token', sessionStorage.getItem('userId'))
            if (this.pCertification !== '') {
              if (this.driving === true) {
                formData.append('pCertification', this.pCertification)
              }
            } else if (this.pLicenseNumber !== '') {
              if (this.driving === false) {
                formData.append('pLicenseNumber', this.pLicenseNumber)
              }
            }
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
            // 必填字段
            let that = this
            // 下一步
            let config = {
              headers: {'Content-Type': 'multipart/form-data'}
            }
            var myreg1 = /^[1][3,4,5,7,8][0-9]{9}$/
            if (!myreg1.test(this.phone)) {
              this.changeColor(2, 'writeMsg')
              alert('您输入的手机号不正确')
            } else {
              const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              that.$http.post(url + 'enterprise/insert', formData, config).then(res => {
                console.log(res.data)
                if (res.data.msg === 'success') {
                  this.$router.push('/HomeTable')
                  loading.close()
                }
              })
            }
          }
        }
      } else {
        if (this.pName === '') {
          this.changeColor(0, 'writeMsg')
        } else if (this.cId === '') {
          this.changeColor(1, 'writeMsg')
        } else if (this.phone === '') {
          this.changeColor(2, 'writeMsg')
        } else if (this.commercial === '') {
          this.changeColor(0, 'bussiness')
        } else {
          if (this.arr.length < 4) {
            alert('请上传需要文件的图片')
          } else {
            var formdata = new FormData()
            formdata.append('userName', this.pName)
            formdata.append('cardId', this.cId)
            formdata.append('phone', this.phone)
            formdata.append('businessRisks', this.commercial)
            formdata.append('insuranceRisks', this.strong)
            formdata.append('transport', this.vehicles)
            formdata.append('monNubmer', this.pMonNubmer)
            formdata.append('yearsNubmer', this.pYearNubmer)
            formdata.append('token', sessionStorage.getItem('userId'))
            if (this.pCertification !== '') {
              if (this.driving === true) {
                formdata.append('certification', this.pCertification)
              }
            } else if (this.pLicenseNumber !== '') {
              if (this.driving === false) {
                formdata.append('licenseNumber', this.pLicenseNumber)
              }
            }
            for (var a = 0; a < this.arr.length - 1; a++) {
              for (var x = 0; x < this.arr.length - 1 - a; x++) {
                if (this.arr[x].id > this.arr[x + 1].id) {
                  var temp1 = this.arr[x]
                  this.arr[x] = this.arr[x + 1]
                  this.arr[x + 1] = temp1
                }
              }
            }
            this.arr.forEach(v => {
              formdata.append('file', v.file)
            })
            // // 下一步
            let that = this
            let config = {
              headers: {'Content-Type': 'multipart/form-data'}
            }
            var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
            if (!myreg.test(this.phone)) {
              this.changeColor(2, 'writeMsg')
              alert('您输入的手机号不正确')
            } else {
              var personId = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/
              if (!personId.test(this.cId)) {
                this.changeColor(1, 'writeMsg')
                alert('您输入的身份证号不正确')
              } else {
                const loading = this.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                })
                that.$http.post(url + 'personal/insert', formdata, config).then(res => {
                  console.log(res.data)
                  if (res.data.msg === 'success') {
                    this.$router.push('/HomeTable')
                    loading.close()
                  } else {
                    alert(res.data.msg)
                  }
                })
              }
            }
          }
        }
      }
    },
    test (i) {
      if (this.arr.length > 0) {
        this.arr.forEach((v, k) => {
          if (v.id === i) {
            this.arr.splice(k, 1)
          }
        })
      }
    },
    // 获取图片
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
        // console.log(this.arr)
        var imgSize = file.size / 1024
        if (imgSize > 3 * 1024) {
          alert('请上传大小不要超过3M的图片')
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
            } else if (i === 4) {
              that.imgChange3 = {
                'background-image': 'url(' + avatar + ')'
              }
            } else if (i === 5) {
              that.imgChange4 = {
                'background-image': 'url(' + avatar + ')'
              }
            } else {
              that.imgChange5 = {
                'background-image': 'url(' + avatar + ')'
              }
            }
          }
        }
      }
    }
  },
  components: {
    HeadTab
  }
}
</script>

<style lang="less" scoped>
.enter {
  background: #fff;
  .first_enter {
    width: 710px;
    margin: 0 auto;
    padding-top: 300px;
    button {
      width: 300px;
      height: 46px;
      border: 0;
      color: #666666;
      border: 1px solid #2e92ff;
      background: #fff;
      border-radius: 5px;
      margin: 0 100px 0 0;
      cursor: pointer;
      &:last-of-type {
        margin: 0;
      }
      &.active {
        color: #fff;
        background: #2e92ff;
      }
    }
  }
  .enter_choose {
    background: #f2f2f2;
    padding: 20px;
    font-size: 16px;
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
    .basic_msg {
      background: #fff;
      padding: 20px;
      .basic_m {
        width: 100%;
        min-width: 1100px;
        background: #fff;
        padding-top: 25px;
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
              &:hover {
                border-color: #bed6ff;
              }
            }
            input[type="button"] {
              width: 80px;
              height: 30px;
              background: #fff;
              border: 0;
              border: 1px solid #ccc;
              border-radius: 4px;
              cursor: pointer;
              outline: none;
              &:first-of-type {
                border: #2E92FF 1px solid;
              }
            }
          }
        }
      }
    }
    .basic_img {
      background: #f2f2f2;
      // padding: 0 20px 20px;
      margin-top: 20px;
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
            margin-bottom: 75px;
            div {
              font-size: 14px;
              width: 118px;
              text-align: right;
              float: left;
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
