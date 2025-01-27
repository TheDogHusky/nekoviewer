<script setup lang="ts">
const state = ref<boolean>(false); // is the window maximized

function maximize() {
    window.ipcRenderer.send('maximize');
}

function minimize() {
    window.ipcRenderer.send('minimize');
}

function close() {
    window.ipcRenderer.send('close');
}

window.ipcRenderer.on('maximized-window', () => {
    state.value = true;
    console.log('maximized');
});

window.ipcRenderer.on('restored-window', () => {
    state.value = false;
    console.log('restored');
});

const icon = computed(() => state.value ? 'nf-cod-chrome_restore' : 'nf-cod-chrome_maximize');
</script>

<template>
    <div class="titlebar">
        <div class="titlebar-items">
            <!-- TODO fix ipx saying wrong image format -->
            <NuxtImg src="/logo.png" format="webp" height="16" width="16" />
            <h1 class="title">NekoViewer</h1>
        </div>
        <div class="titlebar-actions">
            <button @click="minimize" class="titlebar-icon"><Icon name="nf-cod-chrome_minimize" /></button>
            <button @click="maximize" class="titlebar-icon"><Icon :name="icon" /></button>
            <button @click="close" class="titlebar-icon"><Icon name="nf-cod-close" /></button>
        </div>
    </div>
</template>