<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
    error: Object as () => NuxtError
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
    <main class="container error center">
        <h1>Oops! Something broke!</h1>
        <p>Don't worry, we're working on it!</p>
        <button @click="handleError">Clear errors</button>
    </main>
</template>