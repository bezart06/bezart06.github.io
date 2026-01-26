<template>
    <div class="alertMsg" v-if="alert">
        <div class="wrapper al">
            <i class="fas fa-times-circle"></i> {{alert}}
        </div>
    </div>
    <div class="successMsg" v-if="success">
        <div class="wrapper al">
            <i class="fas fa-check-circle"></i> {{success}}
        </div>
    </div>
    <Popup ref="confirm" :title="confirmTitle">
        <div class=" al">
            <i class="fas fa-info-circle"></i> {{confirm}}
            <div class="botBtns">
                <a class="btn5" href="#" @click.prevent="code=1">Yes</a>
                <a class="btn5" href="#" @click.prevent="code=2">No</a>
            </div>
        </div>
    </Popup>
</template>

<script>
export default {
    name: 'Msg',
    data() {
        return {
            alert: "",
            success: "",
            t1: null,
            t2: null
        }
    },
    watch: {
    },
    mounted() {
        if (this.$parent && this.$parent.$parent) {
            this.parent = this.$parent.$parent;
        }
    },
    methods: {
        fadeIn(el, timeout, display) {
            el.style.opacity = 0;
            el.style.display = display || 'block';
            el.style.transition = `opacity ${timeout}ms`;
            setTimeout(() => {
                el.style.opacity = 1;
            }, 10);
        },

        fadeOut(el, timeout) {
            el.style.opacity = 1;
            el.style.transition = `opacity ${timeout}ms`;
            el.style.opacity = 0;

            setTimeout(() => {
                el.style.display = 'none';
            }, timeout);
        },

        successFun(msg){
            this.success = msg;
            var self = this;

            this.$nextTick(() => {
                const block = self.$el.querySelector('.successMsg') || document.querySelector('.successMsg');
                if (block) {
                    block.style.display = 'none';
                    block.style.opacity = '0';

                    clearTimeout(self.t1);
                    clearTimeout(self.t2);

                    self.t1 = setTimeout(function (){
                        self.fadeIn(block, 1000, 'flex');
                        self.t2 = setTimeout(function (){
                            self.fadeOut(block, 1000);
                        }, 3000);
                    }, 100);
                }
            });
        },

        alertFun(msg){
            this.alert = msg;
            var self = this;

            this.$nextTick(() => {
                const block = document.querySelector('.alertMsg');

                if (block) {
                    block.style = "";

                    clearTimeout(self.t1);
                    clearTimeout(self.t2);

                    self.t1 = setTimeout(function (){
                        self.fadeIn(block, 1000, 'flex');
                        self.t2 = setTimeout(function (){
                            self.fadeOut(block, 1000);
                        }, 3000);
                    }, 100);
                }
            });
        },
        confirmFun(title, text){
            this.code = 0;
            var self = this;

            return new Promise(function(resolve, reject) {
                self.confirmTitle = title;
                self.confirm = text;
                self.$refs.confirm.active=1;
                self.interval = setInterval(function (){
                    if(self.code > 0) resolve();
                }, 100);

            }).then(function(){
                clearInterval(self.interval);
                self.$refs.confirm.active = 0;
                if(self.code == 1){
                    return true;
                }
                if(self.code == 2){
                    return false;
                }
            });
        }
    }
}
</script>
