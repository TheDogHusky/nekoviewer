<template>
    <NuxtLoadingIndicator :throttle="0" color="linear-gradient(to right, #bbbbbb, #bbbbfc" />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const infos: Ref<{
    version: string;
    platform: string;
} | null> = ref(null);

onMounted(async () => {
    infos.value = await window.ipcRenderer.invoke('startupInfos');
});

provide('infos', infos);

const updateTitle = () => {
    useHead({
        titleTemplate: (titleChunk) => {
            return titleChunk ? `${titleChunk} - NekoViewer v${infos.value?.version || "loading"}` : `NekoViewer v${infos.value?.version || "loading"}`;
        }
    });
};

watch(infos, updateTitle);
updateTitle();
</script>
