<script setup lang="ts">
const route = useRoute();
const manga = route.params.manga;
const mangaVolumes = ref<MangaVolume[]>([]);
const mangaCover = ref<string>('');
const mangaData = ref<MangaData | null>(null);

const data = await window.ipcRenderer.invoke('getMangaData', manga);
mangaVolumes.value = data.volumes;
mangaCover.value = data.coverImagePath;
console.log(data)
mangaData.value = data.data;

console.log(mangaVolumes.value.map(volume => volume));
</script>

<template>
    <main class="container gap-2">
        <div class="row gap-3 strict manga-infos">
            <NuxtImg placeholder class="manga-cover" :src="mangaCover" height="300px" alt="manga cover"/>
            <div class="column w-auto">
                <h1 class="capitalize">{{ manga }}</h1>
                <p>{{ mangaData?.description }}</p>
                <h3>Genres</h3>
                <div class="genres">
                    <p class="genre" v-for="genre in mangaData?.genres" :key="mangaData?.genres.indexOf(genre)">{{ genre }}</p>
                </div>
                <h3>Author</h3>
                <p class="author">{{ mangaData?.author }}</p>
            </div>
        </div>
        <section class="mt-2 w-100">
            <h2>Volumes</h2>
            <div class="volumes-list">
                <div class="manga-volume" v-for="volume in mangaVolumes" :key="volume.number">
                    <p>Volume {{ volume }}</p>
                    <NuxtLink class="btn btn-secondary btn-small" :to="`/manga/${manga}/volume/${volume.number}`">Read</NuxtLink>
                </div>
            </div>
        </section>
    </main>
</template>