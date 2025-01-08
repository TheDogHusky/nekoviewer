<script setup lang="ts">
const infos: Ref<{
    version: string;
    platform: string;
} | null> | undefined = inject('infos');
</script>

<template>
    <footer>
        <p>Made with ❤ by <span class="author">TheDogHusky</span></p>
        <p>Don't hesitate to contribute!</p>
        <p>Version {{ infos?.version }}, on {{ infos?.platform }}</p>
    </footer>
</template>