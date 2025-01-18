<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
    error: Object as () => NuxtError
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
    <main class="container error center">
        <h1><span class="oops"><span class="special">Oops</span>!</span> Something broke!</h1>
        <p>
            Hey there, it seems like something went wrong here. <br>
            Don't worry, we're working on it!
        </p>
        <button class="btn btn-primary" @click="handleError">Clear errors</button>
    </main>
</template>