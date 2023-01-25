import type { Query } from 'mongoose';
import { z } from 'zod';


export const $relations: unique symbol = Symbol();

export type HasRelations = { [$relations]: any };

export type Infer<T extends z.ZodType, Relations extends object = {}> = z.infer<T> & {
    [$relations]: Relations
};

export type Relations<T extends HasRelations> = T[typeof $relations];

export type Populate<T extends HasRelations, K extends keyof T[typeof $relations]> = Omit<T, K> & {
    [P in K]: T[typeof $relations][P];
}

export type InferPopulate<
    T extends HasRelations,
    K extends string[],
    Q extends Query<any, any, any, any>,
> = Awaited<ReturnType<Q['exec']>> extends any[]
    ? Populate<T, K[number]>[]
    : Populate<T, K[number]>;

