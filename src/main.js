import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import qs from 'qs'

// import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/theme-green/index.css'; // 浅绿色主题
import "babel-polyfill";
// import Mock from './mock'
Vue.prototype.$qs = qs
Vue.prototype.baseUrl = 'http://api.getcard.cn'

Vue.use(ElementUI, { size: 'big' });
Vue.prototype.$axios = axios;
// Mock.init()
//使用钩子函数对路由进行权限跳转

router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    const Guid = localStorage.getItem('ms_Guid');
    if (!role && !Guid && to.path !== '/login') {
        next('/login');
    } else if (to.path == '/login') {
        window.localStorage.clear()
        next()
    } else {
        // next('/');
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
