export default {
    schema: './electron/structures/database/schemas.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: './local-dev.db',
    },
};
