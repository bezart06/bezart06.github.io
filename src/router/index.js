import {createRouter, createWebHashHistory} from 'vue-router'

import Login from '../views/Login.vue'
import Campaigns from '../views/Campaigns.vue'
import Campaign from '../views/Campaign.vue'
import Users from '../views/Users.vue'
import User from '../views/User.vue'
import Ads from '../views/Ads.vue'
import Statistics from '../views/Statistics.vue'
import Payments from '../views/Payments.vue'
import Sites from '../views/Sites.vue'

const Placeholder = {template: '<div>Сторінка в розробці</div>'}

const routes = [
    {
        path: '/',
        name: 'Sign in',
        component: Login
    },
    {
        path: '/campaigns',
        name: 'Campaigns',
        component: Campaigns
    },
    {
        path: '/campaign/:id',
        name: 'Campaign',
        component: Campaign
    },
    {
        path: '/users',
        name: 'Users',
        component: Users
    },
    {
        path: '/user/:id',
        name: 'User',
        component: User
    },
    {
        path: '/ads',
        name: 'Ads',
        component: Ads
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics
    },
    {
        path: '/payments',
        name: 'Payments',
        component: Payments
    },
    {
        path: '/sites',
        name: 'Sites',
        component: Sites
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router
