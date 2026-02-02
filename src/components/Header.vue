<template>
    <header class="header">
        <div class="wrapper">
            <div class="flex">
                <div class="w20 logo">
                    <router-link to="/">
                        <img src="/public/favicon.ico" alt="Logo" />
                    </router-link>
                </div>

                <div class="w70">
                    <div id="menu">
                        <i class="fas fa-bars mobile-bars" @click="menu = 1"></i>

                        <ul :class="{active: menu == 1}" v-if="parent.user && parent.user.auth == 'admin'">
                            <li v-if="menu == 1" class="al close-menu">
                                <i class="fas fa-times" @click="menu = 0"></i>
                            </li>
                            <li>
                                <router-link to="/campaigns" active-class="active-link">
                                    <i class="fas fa-bullhorn"></i> Campaigns
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/users" active-class="active-link">
                                    <i class="fas fa-users"></i> Users
                                </router-link>
                            </li>
                        </ul>

                        <ul :class="{active: menu == 1}" v-else>
                            <li v-if="menu == 1" class="al close-menu">
                                <i class="fas fa-times" @click="menu = 0"></i>
                            </li>
                            <li>
                                <router-link to="/statistics" active-class="active-link">
                                    <i class="fas fa-chart-area"></i> Statistics
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/ads" active-class="active-link">
                                    <i class="fas fa-image"></i> Ads
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/sites" active-class="active-link">
                                    <i class="fab fa-chrome"></i> Sites
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/payments" active-class="active-link">
                                    <i class="fas fa-credit-card"></i> Payments
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="w10 al relative user-top-container" id="user-top" v-if="parent.user && parent.user.name">
                    <div id="user-circle" @click="toggleActive()">
                        {{ parent.user.name[0] }}
                    </div>

                    <div id="user-info" :class="{active: active == 1}">
                        <a href="#" @click.prevent="parent.logout()">
                            <i class="fas fa-sign-out-alt"></i>
                            {{ parent.user.name }} Log out
                        </a>
                    </div>

                    <i @click="toggleActive()" class="fas fa-caret-down caret-icon"></i>
                </div>

                <div class="w10 al" v-else>
                    <router-link to="/" style="color:#fff; text-decoration:none;">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </router-link>
                </div>
            </div>
        </div>
        <Msg ref="msg"></Msg>
    </header>
</template>

<script>
import Msg from "./Msg.vue";

export default {
    name: "Header",
    components: { Msg },
    data: function() {
        return {
            parent: { user: {} },
            active: 0,
            menu: 0
        }
    },
    mounted() {
        this.parent = this.$parent;
    },
    methods: {
        toggleActive() {
            this.active = (this.active === 1) ? 0 : 1;
        }
    }
}
</script>
