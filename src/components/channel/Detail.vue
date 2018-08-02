<template>
  <div class="detail">
    <HeadTab :numtab="Number($route.query.tab)" />
    <div class="enter_choose">
      <header v-if="$route.query.tab === 4"><span>审核未通过</span></header>
      <header v-if="$route.query.tab === 5"><span>退保中心</span></header>
      <div class="basic_msg">
        <p v-if="Data.remarks" v-show="$route.query.tab === 4 || $route.query.tab === 5">
          <img src="../../assets/warn.png" alt="">
          <span>{{ Data.remarks }}</span>
        </p>
        <div class="basic_m">
          <div class="tit">基本信息</div>
          <div class="w" id="writeMsg">
            <div class="r" v-if="!isPerson">
              <span><i>*</i> 企业名称：</span><input type="text" placeholder="请输入企业名称" v-model="Data.enterpriseName">
            </div>
            <div class="r" v-if="isPerson">
              <span><i>*</i> 姓名：</span><input type="text" placeholder="请输入姓名" v-model="Data.personName">
            </div>
            <div class="r" v-if="!isPerson">
              <span><i>*</i> 法人姓名：</span><input type="text" placeholder="请输入法人姓名" v-model="Data.personName">
            </div>
            <div class="r" v-if="isPerson">
              <span><i>*</i> 身份证号：</span>
              <!-- <input type="text" placeholder="请输入身份证号" v-model="cId"> -->
            </div>
            <div class="r">
              <span><i>*</i> 联系方式：</span><input @keyup="numKeyUp" type="text" placeholder="请输入联系方式" v-model="Data.pPhone" @blur="blur">
            </div>
            <div class="r" v-if="Data.pCertification">
              <span>车辆合格证：</span><input type="text" placeholder="请输入你的合格证/车牌号" v-model="Data.pCertification">
            </div>
            <div class="r" v-if="Data.pLicenseNumber">
              <span>车牌号：</span><input type="text" placeholder="请输入你的合格证/车牌号" v-model="Data.pLicenseNumber">
            </div>
          </div>
        </div>
      </div>
      <div class="basic_msg" style="margin-top: 20px;">
        <div class="basic_m">
          <div class="tit">车辆投保</div>
          <div class="w" id="bussiness">
            <div class="r">
              <span><i>*</i> 商业险：</span><input @keyup="numKeyUp" type="text" placeholder="请输入商业险金额" v-model="Data.pBusinessRisks">
            </div>
            <div class="r">
              <span>交强险：</span><input @keyup="numKeyUp" type="text" placeholder="请输入交强险金额" v-model="Data.pInsuranceRisks">
            </div>
            <div class="r">
              <span>车船税：</span><input @keyup="numKeyUp" type="text" placeholder="请输入车船税金额" v-model="Data.pTransport">
            </div>
            <div class="r">
              <span>车险年限：</span>
              <input type="button" id="one" value="一年" @click="yearNumber($event, '1')">
              <input type="button" id="three" value="三年" @click="yearNumber($event, '3')">
            </div>
            <div class="r">
              <span>月付期期数：</span>
              <select @change="monthNumber" id="select" v-model="pMonNumber">
                <option v-for="(data, index) in monArr" :key="index" :value="data">{{data}}</option>
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
              <div class="img" :style="imgChange0" v-if="$route.query.tab !== 2 && $route.query.tab !== 5 & $route.query.tab !== 3">
                <a style="line-height: 40px;" v-if="isShow">请重新上传图片</a>
                <input type="file" @change="fileImage($event, 1)" @click="test(1)" accept="image/jpeg,image/x-png,image/gif">
              </div>
              <a class="img" :style="imgChange0" style="display:block;float:left;" :href="url + Data.pNoticeImage" target="_blank" v-if="$route.query.tab === 2 || $route.query.tab === 5 || $route.query.tab === 3"></a>
            </div>
            <div class="pic" v-if="!isPerson">
              <div>营业执照：</div>
              <div class="img" :style="imgChange1" v-if="$route.query.tab !== 2 && $route.query.tab !== 5 & $route.query.tab !== 3">
                <a style="line-height: 40px;" v-if="isShow">请重新上传图片</a>
                <input type="file" @change="fileImage($event, 2)" @click="test(2)" accept="image/jpeg,image/x-png,image/gif">
              </div>
              <a class="img" :style="imgChange1" style="display:block;float:left;" :href="url + Data.pYImage" target="_blank" v-if="$route.query.tab === 2 || $route.query.tab === 5 || $route.query.tab === 3"></a>
            </div>
            <div class="pic" v-if="driving">
              <div>购车发票：</div>
              <div class="img" :style="imgChange2" v-if="$route.query.tab !== 2 && $route.query.tab !== 5 & $route.query.tab !== 3">
                <a style="line-height: 40px;" v-if="isShow">请重新上传图片</a>
                <input type="file" @change="fileImage($event, 3)" @click="test(3)" accept="image/jpeg,image/x-png,image/gif">
              </div>
              <a class="img" :style="imgChange2" style="display:block;float:left;" :href="url + Data.pGImage" target="_blank" v-if="$route.query.tab === 2 || $route.query.tab === 5 || $route.query.tab === 3"></a>
            </div>
            <div class="pic" v-if="!driving">
              <div>机动车行驶证：</div>
              <div class="img" :style="imgChange3" v-if="$route.query.tab !== 2 && $route.query.tab !== 5 & $route.query.tab !== 3">
                <a style="line-height: 40px;" v-if="isShow">请重新上传图片</a>
                <input type="file" @change="fileImage($event, 4)" @click="test(4)" accept="image/jpeg,image/x-png,image/gif">
              </div>
              <a class="img" :style="imgChange3" style="display:block;float:left;" :href="url + Data.pJImage" target="_blank" v-if="$route.query.tab === 2 || $route.query.tab === 5 || $route.query.tab === 3"></a>
            </div>
            <div class="pic">
              <div>法人身份证(正)：</div>
              <div class="img" :style="imgChange4" v-if="$route.query.tab !== 2 && $route.query.tab !== 5 & $route.query.tab !== 3">
                <a style="line-height: 40px;" v-if="isShow">请重新上传图片</a>
                <input type="file" @change="fileImage($event, 5)" @click="test(5)" accept="image/jpeg,image/x-png,image/gif">
              </div>
              <a class="img" :style="imgChange4" style="display:block;float:left;" :href="url + Data.pFImage" target="_blank" v-if="$route.query.tab === 2 || $route.query.tab === 5 || $route.query.tab === 3"></a>
            </div>
            <div class="pic">
              <div>法人身份证(反)：</div>
              <div class="img" :style="imgChange5" v-if="$route.query.tab !== 2 && $route.query.tab !== 5 & $route.query.tab !== 3">
                <a style="line-height: 40px;" v-if="isShow">请重新上传图片</a>
                <input type="file" @change="fileImage($event, 6)" @click="test(6)" accept="image/jpeg,image/x-png,image/gif">
              </div>
              <a class="img" :style="imgChange5" style="display:block;float:left;" :href="url + Data.pFimagefan" target="_blank" v-if="$route.query.tab === 2 || $route.query.tab === 5 || $route.query.tab === 3"></a>
            </div>
          </div>
          <button @click="$router.go(-1)">退出</button>
          <button @click="nextPage" v-if="isShow">重新提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadTab from '../common/HeadTab'
import url from '../../assets/Req.js'
export default {
  name: 'Detail',
  data () {
    return {
      isPerson: '',
      imgChange0: '',
      imgChange1: '',
      imgChange2: '',
      imgChange3: '',
      imgChange4: '',
      imgChange5: '',
      Data: {},
      monArr: [12],
      pMonNumber: 24,
      arr: [],
      driving: true,
      isShow: false,
      url: url
    }
  },
  mounted () {
    if (this.$route.query.tab === 4) {
      this.isShow = true
    }
    this.getData()
  },
  methods: {
    blur (e) {
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
    numberChange (data) {
      data.target.parentNode.nextSibling.disabled = false
      data.target.parentNode.style.color = '#000'
      if (data.target.value === '车辆合格证') {
        data.target.parentNode.parentNode.nextElementSibling.children[1].disabled = true
        this.driving = true
        data.target.parentNode.parentNode.nextElementSibling.children[0].style.color = '#ccc'
        this.Data.pLicenseNumber = ''
      } else {
        data.target.parentNode.parentNode.previousElementSibling.children[1].disabled = true
        this.driving = false
        data.target.parentNode.parentNode.previousElementSibling.style.color = '#ccc'
        this.Data.pCertification = ''
      }
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
    nextPage () {
      if (this.Data.enterpriseName === '') {
        this.changeColor(0, 'writeMsg')
      } else if (this.Data.personName === '') {
        this.changeColor(1, 'writeMsg')
      } else if (this.Data.pPhone === '') {
        this.changeColor(2, 'writeMsg')
      } else if (this.Data.pBusinessRisks === '') {
        this.changeColor(0, 'bussiness')
      } else {
        if (this.arr.length < 5) {
          alert('请上传需要文件的图片')
        } else {
          var formData = new FormData()
          formData.append('id', this.$route.query.id)
          formData.append('enterpriseName', this.Data.enterpriseName)
          formData.append('personName', this.Data.personName)
          formData.append('pPhone', this.Data.pPhone)
          formData.append('pBusinessRisks', this.Data.pBusinessRisks)
          formData.append('pInsuranceRisks', this.Data.pInsuranceRisks)
          formData.append('pTransport', this.Data.pTransport)
          formData.append('pYearsNubmer', this.Data.pYearNubmer)
          formData.append('pMonNubmer', this.Data.pMonNubmer)
          formData.append('token', sessionStorage.getItem('userId'))
          if (this.Data.pCertification !== '') {
            if (this.driving === true) {
              formData.append('pCertification', this.Data.pCertification)
            }
          } else if (this.Data.pLicenseNumber !== '') {
            if (this.driving === false) {
              formData.append('pLicenseNumber', this.Data.pLicenseNumber)
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
          if (!myreg1.test(this.Data.pPhone)) {
            this.changeColor(2, 'writeMsg')
            alert('您输入的手机号不正确')
          } else {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            that.$http.post(url + 'common/NotAdoptedByEn', formData, config).then(res => {
              // console.log(res)
              if (res.data.msg === 'success') {
                this.$router.push('/HomeTable')
                loading.close()
              }
            })
          }
        }
      }
    },
    numKeyUp () {},
    yearNumber (e, data) {
      this.Data.pYearsNubmer = data
      if (data === '1') {
        e.target.style.borderColor = 'rgb(46, 146, 255)'
        e.target.nextElementSibling.style.borderColor = '#ccc'
        this.monArr = ['12']
      } else if (data === '3') {
        e.target.style.borderColor = 'rgb(46, 146, 255)'
        e.target.previousElementSibling.style.borderColor = '#ccc'
        this.monArr = ['12', '18', '24', '36']
      } else {
        e.target.style.borderColor = 'rgb(46, 146, 255)'
        e.target.nextElementSibling.style.borderColor = '#ccc'
        this.monArr = ['12']
      }
    },
    monthNumber (data) {
      // console.log(data)
      this.Data.pMonNubmer = data.target.value
    },
    getData () {
      let that = this
      that.$http.get(url + 'enterprise/getEnterpriseByid', {
        params: {
          id: this.$route.query.id,
          token: sessionStorage.getItem('userId')
        }
      }).then(res => {
        // console.log(res.data)
        this.Data = res.data.data
        if (this.Data.pYearsNubmer === 1) {
          document.getElementById('one').style.borderColor = 'rgb(46, 146, 255)'
          document.getElementById('three').style.borderColor = '#ccc'
          this.monArr = [12]
        } else if (this.Data.pYearsNubmer === '3') {
          document.getElementById('three').style.borderColor = 'rgb(46, 146, 255)'
          document.getElementById('one').style.borderColor = '#ccc'
          this.monArr = [12, 18, 24, 36]
        } else {
          document.getElementById('one').style.borderColor = 'rgb(46, 146, 255)'
          document.getElementById('three').style.borderColor = '#ccc'
          this.monArr = [12]
        }
        this.pMonNumber = res.data.data.pMonNubmer
        this.imgChange0 = {
          'background-image': 'url(' + url + res.data.data.pNoticeImage + ')'
        }
        this.imgChange1 = {
          'background-image': 'url(' + url + res.data.data.pYImage + ')'
        }
        this.imgChange2 = {
          'background-image': 'url(' + url + res.data.data.pGImage + ')'
        }
        this.imgChange3 = {
          'background-image': 'url(' + url + res.data.data.pJImage + ')'
        }
        this.imgChange4 = {
          'background-image': 'url(' + url + res.data.data.pFImage + ')'
        }
        this.imgChange5 = {
          'background-image': 'url(' + url + res.data.data.pFimagefan + ')'
        }
      })
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
        if (imgSize > 2 * 1024) {
          alert('请上传大小不要超过2M的图片')
        } else {
          var reader = new FileReader()
          reader.readAsDataURL(file) // 读出 base64
          reader.onloadend = function () {
            // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
            var dataURL = reader.result
            var avatar = dataURL
            e.target.offsetParent.children[0].style.display = 'none'
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
.detail {
  background: #fff;
  .enter_choose {
    background: #f2f2f2;
    // padding: 20px;
    font-size: 16px;
    header {
      height: 50px;
      line-height: 50px;
      background: #eaf4ff;
      span {
        border-left: 2px solid #2e92ff;
        padding-left: 20px;
        margin-left: 20px;
      }
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
    .basic_msg {
      background: #fff;
      padding: 20px;
      p {
        text-align: center;
        img {
          width: 18px;
        }
        span {
          line-height: 18px;
          font-size: 18px;
          color: #ffa067;
        }
      }
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
              // background-image: url(../../assets/upload.png);
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
          &:first-of-type {
            background: #fff;
            border: 1px solid #2E92FF;
            color: #2E92FF;
          }
          &:nth-of-type(2) {
            margin-left: 100px;
          }
        }
      }
    }
  }
}
</style>
