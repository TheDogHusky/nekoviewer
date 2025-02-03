<script setup lang="ts">
const infos: Ref<{
    version: string;
    platform: string;
} | null> | undefined = inject('infos');

const sampleMangas = [
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    },
    {
        name: "Tsugumomo",
        image: "/tsugumomo/cover.jpg",
        link: "/book/tsugumomo"
    }
]
</script>

<template>
    <main class="container">
        <h1 class="px-3">Welcome back! Time for a read?</h1>
        <section>
            <h2 class="px-3 mb-0">Recent Lectures</h2>
            <div class="library-container">
                <div class="manga" v-for="manga in sampleMangas" :key="sampleMangas.indexOf(manga)">
                    <NuxtImg :src="manga.image" placeholder width="140px" alt="Manga" />
                    <h3>{{ manga.name }}</h3>
                    <NuxtLink class="manga-btn" :to="manga.link">Resume</NuxtLink>
                </div>
            </div>
        </section>
    </main>
</template>