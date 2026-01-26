<template>
    <header class="header">
        <Msg ref="msg"></Msg>
    </header>
</template>

<script>
import Msg from "./Msg.vue";

export default {
    components: {Msg},
    data: function() {
        return {
            user: {},
            parent: "",
            active: 0,
            menu: 0
        }
    },
    watch: {
    },
    mounted() {
        this.parent = this.parent.parent;
    },
    methods: {
    }
}
</script>
