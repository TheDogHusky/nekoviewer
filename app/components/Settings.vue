<script setup lang="ts">
const settingsPaneActive = useState("settingsPaneActive");
const directory = ref<string>("");

const classes = computed(() => {
    return {
        "settings-pane": true,
        active: settingsPaneActive.value,
    };
});

function toggleSettingsPane() {
    settingsPaneActive.value = !settingsPaneActive.value;
}

async function startScan() {
    console.log("Scanning directory:", directory.value);
    await window.ipcRenderer.invoke(
        "mangas:scanMangaDirectory",
        directory.value,
    );
}

window.ipcRenderer.on("mangas:scanProgress", (e, data) => {
    console.log("Scan progress:", data.percent, "%");
    console.log("Manga ID:", data.id);
    console.log("Manga Name:", data.mangaName);
    console.log("Current File:", data.currentFile);
});
window.ipcRenderer.on("mangas:scanComplete", (e, data) => {
    console.log("Scan finished");
    console.log("Manga data:", data);
});
</script>

<template>
    <div :class="classes">
        <button class="close" @click="toggleSettingsPane">
            <Icon name="nf-md-close" />
        </button>
        <h1>Settings</h1>
        <input type="text" placeholder="Enter directory" v-model="directory" />
        <button class="btn" @click="startScan">Scan</button>
    </div>
</template>