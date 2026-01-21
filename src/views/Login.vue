<template>
    <div class="flex">
        Test Login Text (Зображення: {{ img }})
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
        this.img = this.randomIntFromInterval(1, 7);
    },
    methods: {
        randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
    }
}
</script>
