<script setup lang="ts">
const infos: Ref<{
    version: string;
    platform: string;
} | null> | undefined = inject('infos');

console.log(infos?.value);
</script>

<template>
    <main class="container">
        <h1 class="px-3">Welcome home</h1>
        <section>
            <h2 class="px-3">Recent</h2>
            <div class="library-container">
                <div class="manga">
                    <img src="/manga.jpe" alt="Manga" />
                    <h3>One Piece</h3>
                    <NuxtLink to="/manga/one-piece">Resume</NuxtLink>
                </div>
                <div class="manga">
                    <img src="/manga.jpe" alt="Manga" />
                    <h3>One Piece</h3>
                    <NuxtLink to="/manga/one-piece">Resume</NuxtLink>
                </div>
                <div class="manga">
                    <img src="/manga.jpe" alt="Manga" />
                    <h3>One Piece</h3>
                    <NuxtLink to="/manga/one-piece">Resume</NuxtLink>
                </div>
                <div class="manga">
                    <img src="/manga.jpe" alt="Manga" />
                    <h3>One Piece</h3>
                    <NuxtLink to="/manga/one-piece">Resume</NuxtLink>
                </div>
                <div class="manga">
                    <img src="/manga.jpe" alt="Manga" />
                    <h3>One Piece</h3>
                    <NuxtLink to="/manga/one-piece">Resume</NuxtLink>
                </div>
            </div>
        </section>
    </main>
</template>