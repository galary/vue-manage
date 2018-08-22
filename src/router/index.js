import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [{
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/Administrator',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '管理员权限管理' }
                },
                {
                    path: '/changePassword',
                    component: resolve => require(['../components/page/changePw.vue'], resolve),
                    meta: { title: '修改密码' }
                },
                {
                    path: '/logManage',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '日志管理' }
                },
                {
                    path: '/creditCard',
                    component: resolve => require(['../components/page/cardsTable.vue'], resolve),
                    meta: { title: '银行卡管理' }
                },
                {
                    path: '/bankManage',
                    component: resolve => require(['../components/page/bankTable.vue'], resolve),
                    meta: { title: '银行管理' }
                },
                {
                    path: '/userManage',
                    component: resolve => require(['../components/page/userTable.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/newsTable',
                    component: resolve => require(['../components/page/newsTable.vue'], resolve),
                    meta: { title: '新闻管理' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
// router.beforeEach((to, from, next) => {
//     // console.log('to:' + to.path)
//     if (to.path.startsWith('/login')) {
//         window.localStorage.clear()
//         next()
//     } else {
//         const role = localStorage.getItem('ms_username');
//         const Guid = localStorage.getItem('ms_Guid');
//         if (!role && !ms_Guid) {
//             next({
//                 path: '/login'
//             })
//         } else {
//             next()
//         }
//     }
// })
