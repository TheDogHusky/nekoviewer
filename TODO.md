# TO-DO, a list of things to add to this app

Things to do to make this app better, so I don't forget anything.

## Design

- [ ] Settings pane: navigation to settings categories on sidebar
- [ ] Settings pane: sidebar becomes an off-canvas menu on mobile, with a top left arrow left button open it, followed by the category title, and the close button on the right
- [ ] Manga reader page (/manga/:id/volume/:volume): on mobile, no top right button to open the navbar, but touching the middle of the screen will show it alongside the progression of the reading, and a few controls such as go back, previous page, go to page, next page, go forward, and close the reader
- [ ] Mobile: the navbar only has icon buttons such as settings, library, and hide alongside the logo
- [ ] Manga infos page (/manga/:id): add breakpoints so that the manga synopsis is not too large (and overflows from the div) with a "read more" text (in var(--primary-500) with underline) that expands the div to show the full synopsis (and changes into a "read less" text)
- [ ] Make the whole thing mobile-friendly
- [ ] Add placeholders for images and mangas loading

## Features

- [ ] Read PDF files
- [ ] Library
- [ ] Multiple reading modes
- [ ] Epub and CBR
- [x] Store user data in a local database (.db file) (framework?) (in the future will be changed to accounts on my servers to allow cross-device synchronization) -> drizzle, data.db
- [x] Figure out the "library" / "app home" folder on the computer to store imported manga and other ressources
- [ ] Add keyboard shortcuts

## Code

- [ ] Add a keyboard shortcuts composable (useKeyboardShortcuts) to handle keyboard shortcuts
- [ ] Add a settings composable (useSettings) to store and retrieve settings from the database
- [x] Figure out if the logic should be handed down to electron (such as getting settings, mangas, library, importing, etc..) or if it should be handled in nuxt
- [ ] Add a database composable (useDatabase) to handle the database
- [ ] Add a "mangas" collection in the database
- [ ] Add a "settings" collection in the database
- [ ] Add a "library" collection in the database
- [ ] Add a "reading" collection in the database
- [ ] Add database logic in ~/electron/structures/database/index.ts
- [x] Use Drizzle for the database
- [ ] DB: store mangas in userData/mangas -> /mangas/:id, volumes at /manga/:id/volumes/:volume, pages at /manga/:id/volumes/:volume where volume should be number.pdf (NOTE: if a volume is 18.5, it would be named as 19.pdf, and the volume number would be 18.5)

```
userData folder
├── data.db
├── mangas
│   ├── 1
│   │   ├── cover.jpg
│   │   ├── data.json
│   │   ├── volumes
│   │   │   ├── 1.pdf
│   │   │   ├── 2.pdf
│   │   │   ├── 3.pdf
│   │   │   ├── 4.pdf
│   │   │   ├── 5.pdf
```
