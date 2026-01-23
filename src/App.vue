<template>
    <div id="app-container">
        <router-view></router-view>

    </div>
</template>

<script>
// import

export default {
    name: 'App',
    components: {
        // ...
    },
    data() {
        return {
            url: "https://affiliate.yanbasok.com",
            user: {
                name: "",
                phone: "",
                email: "",
                date: "",
                auth: ""
            },
            formData: {},
            title: "",
            date: "",
            time: "",
        }
    },
    watch: {
        $route() {
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.title = this.$route.name;
            if (this.title) {
                document.title = this.title;
            }
        },
        logout() {
            this.user.auth = "";
            this.$router.push('/');
        },
        scrollTop() {
            window.scrollTo(0, 0);
        },
        scrollBottom() {
            window.scrollTo(0, document.body.scrollHeight);
        },
        page(path = "") {
            this.$router.replace(path);
            this.title = this.$route.name;
            document.title = this.$route.name;
        },
        toFormData(obj) {
            var fd = new FormData();

            for (var x in obj) {
                if (typeof obj[x] === 'object' && x != 'img' && x != 'copy') {
                    for (var y in obj[x]) {
                        if (typeof obj[x][y] === 'object') {
                            for (var z in obj[x][y]) {
                                fd.append(x + '[' + y + '][' + z + ']', obj[x][y][z]);
                            }
                        } else {
                            fd.append(x + '[' + y + ']', obj[x][y]);
                        }
                    }
                } else if (x != 'copy') {
                    fd.append(x, obj[x]);
                }
            }

            return fd;
        }
    }
}
</script>
