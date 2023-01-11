import { FrequentlyAskedQuestion, frequentlyAskedQuestion } from '../../../../data';
import { createTRPCRouter, procedure } from '../../../trpc/base';
import { ServerState } from '../../../../services/mongo/state';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';



const state = new ServerState<{
    questions: FrequentlyAskedQuestion[]
}>('content:faq', {
    /** Initial data; do not edit! */
    questions: [
        {
            id: uuidv4(),
            question: `What is a hackathon?`,
            answer: `<Button color="grape">Testing!</Button>`
        },
        {
            id: uuidv4(),
            question: `Can I participate?`,
            answer: '[answer]'
        },
        {
            id: uuidv4(),
            question: `Sounds cool, but how much does it cost?`,
            answer: '[answer]'
        },
        {
            id: uuidv4(),
            question: `What should I bring?`,
            answer: '[answer]'
        },
        {
            id: uuidv4(),
            question: `Do I need to come with a team?`,
            answer: '[answer]'
        },
        {
            id: uuidv4(),
            question: `How many people per team?`,
            answer: '[answer]'
        },
    ]
})


export const faqRouter = createTRPCRouter({
    list: procedure.public
        .query(async () => {
            const questions = await state.get('questions');
            return { questions }
        }),

    /** Inserts a FAQ entry */
    insert: procedure.protected({ content: { update: true } })
        .input((
            z.object({
                /** The position to insert into. Defaults to the end of the list. */
                position: z.number().optional(),
            }).merge(frequentlyAskedQuestion.omit({ id: true }))
        ))
        .mutation(async ({ input }) => {
            const questions = [...(await state.get('questions'))];
            const { position, ...rest } = input;
            const question: FrequentlyAskedQuestion = {
                id: uuidv4(),
                ...rest,
            }
            if (input.position) {
                questions.splice(input.position, 0, question)
            } else {
                questions.push(question);
            }
            state.set('questions', questions);
            return { questions }
        }),

    /** Updates a FAQ entry */
    update: procedure.protected({ content: { update: true } })
        .input((
            z.object({
                id: z.string(),
                /** Apply an offset to the position of this FAQ entry */
                relativePosition: z.number().optional(),
            }).merge(frequentlyAskedQuestion.omit({ id: true }).partial())
        ))
        .mutation(async ({ input }) => {

        }),

    /** Arranges the FAQs according to the specified order */
    arrange: procedure.protected({ content: { update: true } })
        .input(z.object({
            /** A list of IDs in the desired order */
            order: z.array(z.string())
        }))
        .mutation(async ({ input }) => {

        }),

    /** Deletes a FAQ entry */
    remove: procedure.protected({ content: { delete: true } })
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {

        }),
})

