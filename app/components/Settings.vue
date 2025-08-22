<script setup lang="ts">
const settingsPaneActive = useState('settingsPaneActive');

const classes = computed(() => {
    return {
        'settings-pane': true,
        'active': settingsPaneActive.value
    };
});

function toggleSettingsPane() {
    settingsPaneActive.value = !settingsPaneActive.value;
}
</script>

<template>
    <div :class="classes">
        <button class="close" @click="toggleSettingsPane"><Icon name="nf-md-close" /></button>
        <h1>Settings</h1>
    </div>
</template>