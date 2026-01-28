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

<style scoped>
.popup-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 998;
    background-color: rgba(238, 238, 255, 0.6);
}

.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 500px;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    border-radius: 4px;
    overflow: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.popup.fullscreen {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
}

.head-popup {
    background-color: #e4e8ec;
    padding: 0 20px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.popup-inner {
    padding: 20px;
    overflow-y: auto;
}

.flex { display: flex; width: 100%; }
.w80 { width: 80%; }
.w20 { width: 20%; }
.ptb20 { padding: 20px 0; }
.head-title { font-weight: bold; font-size: 16px; color: #333; }
.text-right { text-align: right; }
.al a { color: #333; font-size: 18px; text-decoration: none; }
.al a:hover { color: #d32f2f; }
</style>
