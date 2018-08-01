 <template>
  <div class="head_tab">
    <ul>
      <li v-for="(item, index) in tabs" :key="index" :class="{active:index == num}" @click="tab(index)" >{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HeadTab',
  data () {
    return {
      num: 0,
      tabs: ['首页', '申请入口', '待分期', '已分期', '未通过', '退保中心'],
      route: ['/HomeTable', '/Enter', '/NoStaging', '/AlreadyStaging', '/Nothrough', '/RetreatCenter']
    }
  },
  mounted () {
    this.num = this.numtab
    if (!sessionStorage.getItem('userId')) {
      this.$router.push('/')
    }
  },
  methods: {
    tab (index) {
      this.num = index
      this.$router.push(this.route[index])
      if (index === 1) {
        this.$emit('refresh')
      }
    }
  },
  props: {
    numtab: {
      type: Number,
      default () {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.head_tab {
  height: 60px;
  width: 100%;
  background: #fff;
  position: relative;
  ul {
    padding-left: 30px;
    li {
      float: left;
      padding: 0 30px;
      line-height: 58px;
      font-size: 18px;
      color: #333;
      cursor: pointer;
    }
    .active {
      border-bottom:2px solid #2E92FF;
      color: #2E92FF;
    }
  }
}
</style>
