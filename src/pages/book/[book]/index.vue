<script setup lang="ts">
const route = useRoute();
const manga = route.params.book;
const mangaVolumes = ref<MangaVolume[]>([]);
const mangaCover = ref<string>('');
const mangaData = ref<MangaData | null>(null);

const data = await window.ipcRenderer.invoke('books:getBookData', manga);
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
                <div class="manga-volume" v-for="volume in mangaVolumes" v-if="mangaVolumes.length" :key="volume.number">
                    <p>Volume {{ volume }}</p>
                    <NuxtLink class="btn btn-secondary btn-small" :to="`/book/${manga}/volume/${volume.number}`">Read</NuxtLink>
                </div>
                <div v-else class="manga-volume no-volume">
                    <p>Oops, seems like you don't have any volumes of this book..</p>
                </div>
            </div>
        </section>
    </main>
</template>