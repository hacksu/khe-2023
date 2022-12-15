import chalk from 'chalk';
import { z, ZodObject, ZodString } from 'zod';
import { logger } from './logging';
import get from 'lodash/get';
import merge from 'lodash/merge';
import dotenv from 'dotenv';


dotenv.config();
dotenv.config({
    override: true,
    path: process.cwd() + '/.env.local',
});

const HELP = process.argv.find(o => o.endsWith('help')) !== undefined;

type PopulateConfig<T> = {
    [P in keyof T]?: Partial<T[P]> | any
}

const log = logger.getChildLogger({ name: 'config' });
export function populateConfig<T extends z.AnyZodObject>(schema: T, ...configs: (() => PopulateConfig<z.infer<T>>)[]): z.infer<T> {
    const config = merge({}, ...configs.map(o => o()));
    const parsed = schema.safeParse(config);
    if (!parsed.success) {
        if (!HELP) {
            defineConfig(schema, parsed.error.issues.map(o => o.path.join('.')));
        }
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


export function defineConfig<T extends z.AnyZodObject>(schema: T, highlight: string[] | null = null) {
    if (HELP || highlight) {
        console.log();
        console.log(chalk.magenta('CONFIGURATION'));
        recursivePrint(schema, [], highlight);
        console.log();
    }
}

function recursivePrint<O extends z.AnyZodObject>(obj: O, keys: string[] = [], highlight: string[] | null = null) {
    for (const key in obj.shape) {
        const value: z.ZodType = obj.shape[key];
        const path = [...keys, key].join('.');
        const isHighlighted = highlight?.includes(path) || false;
        const nameColor = isHighlighted ? chalk.red.underline : chalk.yellow;
        const str = `${nameColor(key)}\t${chalk.grey(value.description || '')}`;
        console.log('  '.repeat(keys.length) + ` - ` + str);
        // @ts-ignore
        if (value._def?.innerType instanceof ZodObject) {
            // @ts-ignore
            recursivePrint({ shape: value._def.innerType._def.shape() }, [...keys, key], highlight);
        }
    }
}