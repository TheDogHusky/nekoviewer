<script setup lang="ts">
const state = ref<boolean>(false);// is the window maximized

/**
 * Maximize the window
 */
function maximize() {
    window.ipcRenderer.send('window:maximize'); // send the maximize event to the main process
}

/**
 * Minimize the window
 */
function minimize() {
    window.ipcRenderer.send('window:minimize'); // send the minimize event to the main process
}

/**
 * Close the window
 */
function close() {
    window.ipcRenderer.send('window:close'); // send the close event to the main process
}

/**
 * Updates the state property when the main process sent back the maximized-window event after successfully maximizing the window
 */
window.ipcRenderer.on('maximized-window', () => {
    state.value = true;
});

/**
 * Updates the state property when the main process sent back the restored-window event after successfully restoring the window
 */
window.ipcRenderer.on('restored-window', () => {
    state.value = false;
});

const icon = computed(() => state.value ? 'nf-cod-chrome_restore' : 'nf-cod-chrome_maximize');
</script>

<template>
    <div class="titlebar">
        <div class="titlebar-items">
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