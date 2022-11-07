import { z } from 'zod';

export type TimestampData = z.infer<typeof timestampData>;

export const timestampData = z.object({
    created: z.string().or(z.date().default(new Date())),
    updated: z.string().or(z.date().default(new Date())),
})