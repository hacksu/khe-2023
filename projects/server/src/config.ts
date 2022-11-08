import { defineConfig, populateConfig } from './utils/config';
import { z } from 'zod';
import { log } from './utils/logging';
import chalk from 'chalk';


/** Define configuration */
const configSchema = z.object({

    /** The mode the project is running in */
    mode: z.enum(['development', 'production', 'test'])
        .default(process.env.NODE_ENV || 'development' as any),

    /** MongoDB Connection URI */
    mongo: z.string().startsWith('mongodb://')
        .default(process.env.MONGO as any)
        .describe(`MONGO=(mongodb://) MongoDB connection URI for the database`),

    /** Should the server handle reverse proxying to the other projects? */
    proxy: z.boolean()
        .default(process.env.PROXY === 'true')
        .describe(`PROXY=?(true|false) Flag to disable reverse proxy`),

    /** Are permissions disabled? */
    disablePermissions: z.boolean()
        .default(process.env.DISABLE_PERMISSIONS === 'true')
        .describe(`DISABLE_PERMISSIONS=?(true|false) Flag to disable the RBAC permission service`),

});

defineConfig(configSchema);

/** Import and parse config from various sources */
export const config = populateConfig(configSchema, () => ({

}))

// console.log(config);