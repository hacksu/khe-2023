import chalk from 'chalk';
import { z } from 'zod';
import { logger } from './logging';
import get from 'lodash/get';
import merge from 'lodash/merge';
import dotenv from 'dotenv';


dotenv.config();

const log = logger.getChildLogger({ name: 'config' });
export function registerConfig<T extends z.AnyZodObject>(schema: T, ...configs: (() => object)[]): z.infer<T> {
    const config = merge({}, ...configs.map(o => o()));
    const parsed = schema.safeParse(config);
    if (!parsed.success) {
        for (const issue of parsed.error.issues) {
            log.error(
                chalk.yellow(issue.path.join('.')),
                '=', get(config, issue.path.join('.')),
                ':', issue.message
            );
        }
        process.exit(1);
    }
    return parsed.data;
}

