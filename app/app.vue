<template>
    <NuxtLoadingIndicator color="linear-gradient(to right, #eb7763, #783024, #ec474f" />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const infos: Ref<AppStartupInfos> = ref(null);

onMounted(async () => {
    infos.value = await window.ipcRenderer.invoke('app:startupInfos');
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
