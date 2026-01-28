<template>
    <div v-if="active==1" class="popup-wrapper">
        <div class="popup-back" @click="active=0"></div>
        <div class="popup" :class="{ 'fullscreen': fullscreen }">
            <div class="flex head-popup">
                <div class="w80 ptb20">
                    <div class="head-title">{{title}}</div>
                </div>
                <div class="w20 al ptb20 text-right">
                    <a href="#" @click.prevent="active=0"><i class="fas fa-window-close"></i></a>
                </div>
            </div>
            <div class="popup-inner">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Popup',
    props: ['title', 'fullscreen'],
    data() {
        return {
            active: 0
        }
    }
}
</script>
