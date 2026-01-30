<template>
    <div class="login-container">
        <div class="login-form-wrapper">
             <div class="form inner-form">
                <form @submit.prevent="login()">
                    <h1>Sign in</h1>
                    <div class="row">
                        <label>Email</label>
                        <input type="email" v-model="form.email" required>
                    </div>
                    <div class="row">
                        <label>Password</label>
                        <input type="password" v-model="form.password" required>
                    </div>
                    <div class="row">
                        <button class="btn">SIGN IN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'Login',
    data() {
        return {
            form: {
                email: "",
                password: ""
            },
            parent: null
        }
    },
    mounted() {
        this.parent = this.$root;
        if(this.parent.user && this.parent.user.auth) {
            this.$router.push('/campaigns');
        }
    },
    methods: {
        login() {
            var self = this;
            var data = self.parent.toFormData(self.form);

            axios.post(this.parent.url + "/site/login", data).then(function(response) {
                if (response.data.error) {
                    self.parent.$refs.msg.alertFun(response.data.error);
                } else {
                    self.parent.user = response.data;

                    window.localStorage.setItem('user', JSON.stringify(self.parent.user));

                    self.$router.push('/campaigns');
                }
            }).catch(function(error) {
                console.log(error);
            });
        }
    }
}
</script>
