import Vue from "vue";
import VueRouter from "vue-router";
import findLast from "lodash/findLast";
import NotFount from "../views/404.vue";
import Forbbiden from "../views/403.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { check, isLogin } from "../utils/auth";
import { notification } from "ant-design-vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/layout",
    hideInMenu: true,
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/UserLayout.vue"),
    children: [
      {
        path: "/user",
        redirect: "/user/login"
      },
      {
        path: "/user/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/User/Login.vue")
      },
      {
        path: "/user/register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "../views/User/Register.vue")
      }
    ]
  },
  {
    path: "/",
    meta: { authority: ["user", "admin"] },
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: { icon: "dashboard", title: "仪表盘" },
        component: { render: h => h("router-view") },
        children: [
          {
            path: "/dashboard/analysis",
            name: "analysis",
            meta: { title: "分析页" },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ "../views/Dashboard/Analysis.vue"
              )
          }
        ]
      },
      //form
      {
        path: "/form",
        name: "form",
        meta: { icon: "form", title: "表单", authority: ["admin"] },
        component: { render: h => h("router-view") },
        children: [
          {
            path: "/form/basic-form",
            name: "basicform",
            meta: { title: "基础表单" },
            component: () =>
              import(
                /* webpackChunkName: "form" */ "../views/Forms/BasicForm.vue"
              )
          },
          {
            path: "/form/step-form",
            name: "stepform",
            meta: { title: "分布表单" },
            hideChildrenInMenu: true,
            component: () =>
              import(/* webpackChunkName: "form" */ "../views/Forms/StepForm"),
            children: [
              {
                path: "/form/step-form",
                redirect: "/form/step-form/info"
              },
              {
                path: "/form/step-form/info",
                name: "info",
                component: () =>
                  import(
                    /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step1.vue"
                  )
              },
              {
                path: "/form/step-form/confirm",
                name: "confirm",
                component: () =>
                  import(
                    /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step2.vue"
                  )
              },
              {
                path: "/form/step-form/result",
                name: "result",
                component: () =>
                  import(
                    /* webpackChunkName: "form" */ "../views/Forms/StepForm/Step3.vue"
                  )
              }
            ]
          }
        ]
      }
    ]
  },

  {
    path: "/403",
    name: "403",
    hideInMenu: true,
    component: Forbbiden
  },

  {
    path: "*",
    name: "404",
    hideInMenu: true,
    component: NotFount
  }
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path != from.path) {
    NProgress.start();
  }
  const record = findLast(to.matched, record => record.meta.authority); // 获取当前路径最近的一个路由的信息
  if (record && !check(record.meta.authority)) {
    // 路由信息存在且无权限
    if (!isLogin && to.path !== "/user/login") {
      // 未登录且不是在登录页
      next({
        path: "/user/login"
      });
    } else if (to.path !== "/403") {
      // 已经登录但是无权限
      notification.error({
        message: "403",
        description: "没有访问权限，请联系管理员。"
      });
      next({
        path: "/403"
      });
    }
    NProgress.done(); // 需要在这里关闭路由跳转的动画因为没有执行到next无法走关闭动画路线
  }
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
