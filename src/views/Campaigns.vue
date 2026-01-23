<template>
    <div class="campaigns">
        Campaigns
    </div>
</template>

<script>
export default {
    name: 'Campaigns',
    data() {
        return {
            parent: null,
        };
    },
    mounted() {
        this.parent = this.$parent;

        if (!this.parent.user || !this.parent.user.auth) {
            this.parent.logout();
        }
    }
};
</script>
