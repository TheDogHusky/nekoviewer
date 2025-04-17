export default {
    schema: './src/electron/structures/database/schemas.ts',
    out: './src/electron/structures/database/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './local-dev.db',
    },
};
