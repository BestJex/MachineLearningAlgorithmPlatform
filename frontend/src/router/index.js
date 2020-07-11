import Vue from "vue";
import Router from "vue-router";
import layout from "@/components/layout";

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            name: 'NotFound',
            redirect: '/project',
        },
        {
            path: '/',
            component: layout,
            redirect: '/project',
            children: [{
                    name: 'Project',
                    path: 'project',
                    component: () => import('@/components/User/Project'),
                }],
        },
        {
            path: '/personal',
            name: 'Personal',
            component: () => import('@/components/User/Information'),
        },
        {
            path: '/graph/',
            component: layout,
            hidden: true,
            children: [{
                name: 'Graph',
                path: ':id',
                component: () => import('@/components/Editor/index'),
            }]
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/components/User/Login'),
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('@/components/User/Register'),
        },
        {
            path: '/retrieve',
            name: 'Retrieve',
            component: () => import('@/components/User/Retrieve'),
        },
    ]
})