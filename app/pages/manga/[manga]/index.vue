<script setup lang="ts">
const route = useRoute();
const manga = route.params.manga;

const data = ref<MangaDataIPCAnswer>(await window.ipcRenderer.invoke('mangas:getMangaData', manga));
console.log(data.value);
</script>

<template>
    <main class="container gap-2">
        <div class="row gap-3 strict manga-infos">
            <NuxtImg placeholder class="manga-cover" :src="data.coverImagePath" height="300px" alt="manga cover"/>
            <div class="column w-auto">
                <h1 class="capitalize">{{ data.data.name }}</h1>
                <p>{{ data.data.description }}</p>
                <h3>Genres</h3>
                <div class="genres">
                    <p class="genre" v-for="genre in data.data.genres" :key="data.data.genres.indexOf(genre)">{{ genre }}</p>
                </div>
                <h3>Author</h3>
                <p class="author">{{ data.data.author }}</p>
            </div>
        </div>
        <section class="mt-2 w-100">
            <h2>Volumes</h2>
            <div class="volumes-list">
                <div class="manga-volume" v-for="volume in data.volumes" v-if="data.volumes.length" :key="volume">
                    <p>Volume {{ volume }}</p>
                    <NuxtLink class="btn btn-secondary btn-small" :to="`/manga/${manga}/volume/${volume}`">Read</NuxtLink>
                </div>
                <div v-else class="manga-volume no-volume">
                    <p>Oops, seems like you don't have any volumes of this manga..</p>
                </div>
            </div>
        </section>
    </main>
</template>