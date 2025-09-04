<script setup lang="ts">
const infos: Ref<AppStartupInfos> | undefined = inject('infos');

const recent: Ref<MangaData[] | null> = ref(await window.ipcRenderer.invoke('mangas:getRecentMangas'));
</script>

<template>
    <main class="container">
        <h1 class="px-3">Welcome back! Time for a read?</h1>
        <section>
            <h2 class="px-3 mb-0">Recent Lectures</h2>
            <LibraryContainer>
                <LibraryManga v-if="recent" v-for="manga in recent" :key="recent.indexOf(manga)" :manga="manga"/>
                <div v-else class="no-manga">
                    <p>Oops, seems like you don't have any recent lectures..</p>
                </div>
            </LibraryContainer>
        </section>
    </main>
</template>