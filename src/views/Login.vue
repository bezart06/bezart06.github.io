<template>
    <div class="login-container">
        <div class="left-side">
            </div>

        <div class="right-side">
            <div class="top-bar">
                <span class="top-bar-text">Affiliate Sign In</span>
                <div class="top-bar-image">
                    <img src="/favicon.ico" alt="Logo" />
                </div>
            </div>

            <div class="form-wrapper">

                <form @submit.prevent="handleLogin">
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
                        />
                    </div>

                    <button type="submit" class="btn-login">SIGN IN</button>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            img: 1,
            hs: 0,
        }
    },
    mounted() {
        // test
    },
    methods: {
        // test
    }
}
</script>
