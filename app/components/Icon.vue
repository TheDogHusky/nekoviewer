<script setup lang="ts">
const props = defineProps<{
    name: string;
    [key: string]: any;
}>();

const iconClass = computed(() => {
    return `nf ${props.name}`;
});

const iconProps = computed(() => {
    const { name, ...rest } = props;
    return rest;
});
</script>

<template>
    <i :class="iconClass" v-bind="iconProps"></i>
</template>

<style scoped>
@import url('~/assets/css/nf.css');
</style>