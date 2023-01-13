import { z } from 'zod';


export const $relations: unique symbol = Symbol();

export type Infer<T extends z.ZodType, Relations extends object = {}> = z.infer<T> & {
    [$relations]: Relations
};

export type Relations<T extends { [$relations]: any }> = T[typeof $relations];

export type Populate<T extends { [$relations]: any }, K extends keyof T[typeof $relations]> = Omit<T, K> & {
    [P in K]: T[typeof $relations][P];
}
