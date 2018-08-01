import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import ChannelApplication from '@/components/ChannelApplication'
import Condition from '@/components/Condition'
import Application from '@/components/Application'
import ConfirmPolicy from '@/components/ConfirmPolicy'
import Detail from '@/components/channel/Detail'
import PDetail from '@/components/channel/PDetail'
import Individual from '@/components/alert/Individual'
import AlerdyDetail from '@/components/alert/AlerdyDetail'
import HomeTable from '@/components/channel/HomeTable'
import Enter from '@/components/channel/Enter'
import NoStaging from '@/components/channel/NoStaging'
import RetreatCenter from '@/components/channel/RetreatCenter'
import AlreadyStaging from '@/components/channel/AlreadyStaging'
import Nothrough from '@/components/channel/Nothrough'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    // {
    //   path: '/hello',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/ChannelApplication',
      name: 'ChannelApplication',
      component: ChannelApplication
    },
    {
      path: '/Enter',
      name: 'Enter',
      component: Enter
    },
    {
      path: '/HomeTable',
      name: 'HomeTable',
      component: HomeTable
    },
    {
      path: '/NoStaging',
      name: 'NoStaging',
      component: NoStaging
    },
    {
      path: '/RetreatCenter',
      name: 'RetreatCenter',
      component: RetreatCenter
    },
    {
      path: '/AlreadyStaging',
      name: 'AlreadyStaging',
      component: AlreadyStaging
    },
    {
      path: '/Nothrough',
      name: 'Nothrough',
      component: Nothrough
    },
    {
      path: '/Condition',
      name: 'Condition',
      component: Condition
    },
    {
      path: '/Application',
      name: 'Application',
      component: Application
    },
    {
      path: '/ConfirmPolicy',
      name: 'ConfirmPolicy',
      component: ConfirmPolicy
    },
    {
      path: '/Detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/PDetail',
      name: 'PDetail',
      component: PDetail
    },
    {
      path: '/Individual',
      name: 'Individual',
      component: Individual
    },
    {
      path: '/AlerdyDetail',
      name: 'AlerdyDetail',
      component: AlerdyDetail
    }
  ]
})
