<template>
    <label class="tg-switch">
        <input
            type="checkbox"
            v-model="internalValue"
            @change="updateValue"
        >
        <span class="tg-slider"></span>
    </label>
</template>

<script>
export default {
    name: 'Toggle',
    props: {
        modelValue: {
            type: [String, Number, Boolean],
            default: "1"
        }
    },
    emits: ['update:modelValue', 'change'],
    data() {
        return {
            internalValue: false
        }
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(val) {
                this.internalValue = (val === '1' || val === 1 || val === 'true' || val === true);
            }
        }
    },
    methods: {
        updateValue() {
            const valueToSend = this.internalValue ? "1" : "0";

            this.$emit('update:modelValue', valueToSend);
            this.$emit('change', valueToSend);
        }
    }
}
</script>
