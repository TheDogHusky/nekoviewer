<script setup lang="ts">
const infos: Ref<{
    version: string;
    platform: string;
} | null> | undefined = inject('infos');

const route = useRoute();
const path = ref<string>(route.path);

watch(route, (newRoute) => {
    path.value = newRoute.path;
});

const classes = computed(() => {
    return {
        'hidden': path.value.startsWith('/manga/')
    };
});
</script>

<template>
    <footer :class="classes">
        <p>Made with ❤ by <span class="author">TheDogHusky</span></p>
        <p>Don't hesitate to contribute!</p>
        <p>Version {{ infos?.version }}, on {{ infos?.platform }}</p>
    </footer>
</template>