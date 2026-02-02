<template>
    <div class="login-container">
        <Msg ref="msg"></Msg>

        <div class="left-side">
            <img :src="parent.url+'/app/views/images/Cover_'+img+'.jpg'" alt="Background">
        </div>

        <div class="right-side">
            <div class="top-bar">
                <span class="top-bar-text">Affiliate Sign In</span>
                <div class="top-bar-image">
                    <img :src="parent.url+'/app/views/images/logo.svg'" alt="Logo"/>
                </div>
            </div>

            <div class="form-wrapper">

                <form @submit.prevent="handleLogin" v-if="parent.formData">
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            v-model="email"
                            required
                        />
                    </div>

                    <div class="input-group">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            v-model="password"
                            required
                            autocomplete="on"
                        />
                    </div>

                    <button type="submit" class="btn-login">SIGN IN</button>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Msg from '../components/Msg.vue';

export default {
    name: 'Login',
    components: {
        Msg
    },
    data() {
        return {
            img: 1,
            parent: {url: ''},
            email: "",
            password: ""
        }
    },
    mounted: function () {
        this.img = this.randomIntFromInterval(1, 7);
        this.parent = this.$root;
    },
    methods: {
        randomIntFromInterval: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        handleLogin() {
            this.parent.formData = {
                email: this.email,
                password: this.password
            };

            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(self.parent.url + "/site/login", data).then(function (response) {
                if (response.data.error) {
                    if (self.$refs.msg) {
                        self.$refs.msg.alertFun(response.data.error);
                    } else {
                        console.error("Помилка:", response.data.error);
                        alert(response.data.error);
                    }
                }
                if (response.data.user) {
                    self.parent.user = response.data.user;
                    self.parent.page('/campaigns');
                    window.localStorage.setItem('user', JSON.stringify(self.parent.user));
                }
            }).catch(function (error) {
                console.log('errors : ', error);
            });
        }
    }
}
</script>
