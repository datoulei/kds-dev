import Vue from 'vue';
import Router from 'vue-router';
import BasicLayout from '@/layout/BasicLayout';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/dashboard',
      component: BasicLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/view/Dashboard')
        },
        {
          path: '/outerScreen',
          name: 'outerScreen',
          component: () => import('@/view/OuterScreenPage')
        },
      ]
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('@/view/LoginPage')
    },
    {
      path: '/innerScreen',
      name: 'innerScreen',
      component: () => import('@/view/InnerScreenPage')
    },

    {
      path: '*',
      redirect: '/'
    }
  ]
});
