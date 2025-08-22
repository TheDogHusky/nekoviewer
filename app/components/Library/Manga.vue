<script setup lang="ts">
import { cleanMangaName } from "~/utils/functions";

const props = defineProps<{
    manga: MangaData;
}>();

const { manga } = props;
</script>

<template>
    <div class="manga">
        <NuxtImg :src="manga.cover" placeholder width="140px" alt="Manga" />
        <h3>{{ manga.name }}</h3>
        <NuxtLink class="manga-btn" :to="`/manga/${cleanMangaName(manga.name)}`">Resume</NuxtLink>
    </div>
</template>