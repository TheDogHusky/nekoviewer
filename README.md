# NekoViewer

Yet another manga reader, built with Nuxt3 and Electron.

## Features

- [ ] Read PDF files
- [ ] Library 
- [ ] Multiple reading modes
- [ ] Epub and CBR
- [ ] Cross-platform
- [ ] Cross-device

You can have a list of upcoming features or work in the [TODO.md](TODO.md) file.

## Motivation

I was tired of the hundred of readers on windows that just doesn't support PDF, or supports it badly, and doesn't follow my preferred way of reading manga (no animation, just page change, because of my stability issues).

So then I thought of something: what if, for fun, I made a cross-platform and cross-device manga reader, so nobody ever has to synchronize their data through a ton of websites and apps? NekoViewer was born.

## Setup

Please use the installer for your operating system in the releases.
Otherwise, you'll need Node.js v20 or never, alongside Yarn.

Make sure to install dependencies:

```bash
yarn
```

## Development

### Database

Make a local-dev.db file in the root folder.

### App

Start the app on development:

```bash
yarn dev
```

If it is the first time, it will create a firstStartup file in the project folder on development, allowing you to simulate a first startup by putting `true` in it. 