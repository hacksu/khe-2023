import { z } from 'zod';


export type FrequentlyAskedQuestion = z.infer<typeof frequentlyAskedQuestion>;
export const frequentlyAskedQuestion = z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
})