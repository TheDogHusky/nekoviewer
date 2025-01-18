<script setup lang="ts">
const settingsPaneActive = useState('settingsPaneActive');
const headerHidden = ref(false);

function toggleSettingsPane() {
    settingsPaneActive.value = !settingsPaneActive.value;
}

function toggleHeader() {
    headerHidden.value = !headerHidden.value;
}

const classes = computed(() => {
    return {
        'hidden': headerHidden.value
    };
})
</script>

<template>
    <header :class="classes">
        <button class="open" @click="toggleHeader"><Icon name="nf-md-arrow_down" /></button>
        <nav>
            <div class="nav-brand">
                <NuxtLink to="/">
                    <img src="/logo.png" alt="Logo" />
                    <h1><span class="neko">Neko</span>Viewer</h1>
                </NuxtLink>
            </div>
            <div class="open-menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="nav-menu">
                <div class="nav-menu-left">
                    <ul class="nav-items">
                        <li class="nav-item">
                            <NuxtLink to="/">Home</NuxtLink>
                        </li>
                        <li class="nav-item">
                            <NuxtLink to="/recent">Recent</NuxtLink>
                        </li>
                        <li class="nav-item">
                            <NuxtLink to="/library">Your Library</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="nav-menu-right">
                    <ul class="nav-items">
                        <li class="nav-item">
                            <VTooltip>
                                <button class="nav-item icon" @click="toggleHeader"><Icon name="nf-md-arrow_up" /></button>

                                <template #popper>
                                    Hide
                                </template>
                            </VTooltip>
                        </li>
                        <li class="nav-item">
                            <VTooltip>
                                <button class="nav-item icon" @click="toggleSettingsPane"><Icon name="nf-oct-gear" /></button>

                                <template #popper>
                                    Settings
                                </template>
                            </VTooltip>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>