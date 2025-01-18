<script setup lang="ts">
const settingsPaneActive = useState('settingsPaneActive');
</script>

<template>
    <div class="settings-pane" v-if="settingsPaneActive">
        <h1>Hello settings</h1>
    </div>
</template>