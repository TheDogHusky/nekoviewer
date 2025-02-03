<script setup lang="ts">
const infos: Ref<{
    version: string;
    platform: string;
} | null> | undefined = inject('infos');

const recent: Ref<MangaData[] | null> = ref(await window.ipcRenderer.invoke('books:getRecentBooks'));
</script>

<template>
    <main class="container">
        <h1 class="px-3">Welcome back! Time for a read?</h1>
        <section>
            <h2 class="px-3 mb-0">Recent Lectures</h2>
            <div class="library-container">
                <div class="manga" v-if="recent" v-for="manga in recent" :key="recent.indexOf(manga)">
                    <NuxtImg :src="manga.cover" placeholder width="140px" alt="Manga" />
                    <h3>{{ manga.name }}</h3>
                    <!-- TODO make a function to clean manga name for the URL -->
                    <NuxtLink class="manga-btn" :to="`/book/${manga.name.toLowerCase()}`">Resume</NuxtLink>
                </div>
                <div v-else class="no-manga">
                    <p>Oops, seems like you don't have any recent lectures..</p>
                </div>
            </div>
        </section>
    </main>
</template>