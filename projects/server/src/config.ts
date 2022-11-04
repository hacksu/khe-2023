import { registerConfig } from './utils/config';
import { z } from 'zod';


/** Define configuration */
const configSchema = z.object({
    /** The mode the project is running in */
    mode: z.enum(['development', 'production', 'test']),
    /** MongoDB Connection URI */
    mongo: z.string().startsWith('mongodb://'),
    /** Should the server handle reverse proxying to the other projects? */
    proxy: z.boolean().default(false),
    /** Are permissions disabled? */
    disablePermissions: z.boolean().default(false),
});


/** Import and parse config from various sources */
export const config = registerConfig(configSchema, () => ({
    mode: process.env.NODE_ENV || 'development',
    mongo: process.env.MONGO,
    proxy: Boolean(process.env.PROXY === 'true'),
    disabledPermissions: Boolean(process.env.DISABLE_PERMISSIONS === 'true'), 
}))

