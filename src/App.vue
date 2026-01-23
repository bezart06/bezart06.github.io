<template>
    <div id="app-container">
        <Msg ref="msg"></Msg>
        <router-view></router-view>
    </div>
</template>

<script>
import { msg } from './components/msg.js'

export default {
    name: 'App',
    components: {
        Msg: msg
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
        $route:function() {
            this.init();
        }
    },
    mounted:function() {
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
            this.user = {name:"", phone:"", email:"", date:"", auth:""};
            this.page('/');
            window.localStorage.setItem('user', '');
        },
        scrollTop() {
            setTimeout(function (){
                window.scroll({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 50);
        },
        scrollBottom() {
            setTimeout(function(){
                window.scroll({
                    top: 1000,
                    behavior: 'smooth'
                });
            }, 50);
        },
        page:function (path="") {
            this.$router.replace(path);
            this.title = this.$route['name'];
            document.title = this.$route['name'];
        },
        toFormData:function(obj) {
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
