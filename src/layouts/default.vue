<script setup lang="ts">
const route = useRoute();
const path = ref<string>(route.path);

watch(route, (newRoute) => {
    path.value = newRoute.path;
});

const classes = computed(() => {
    return {
        'content': true,
        'no-scroll': /^\/manga\/.*\/volume\//.test(path.value)
    };
});
</script>

<template>
    <Titlebar />
    <div :class="classes">
        <Header />
        <slot />
        <Footer />
        <Settings />
    </div>
</template>