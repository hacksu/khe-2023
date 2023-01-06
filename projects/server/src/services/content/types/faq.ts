import { z } from 'zod';
import { access } from '../../permissions/middleware';
import { ServerState } from '../../mongo/state'
import { t } from '../../trpc';
import { FrequentlyAskedQuestion, frequentlyAskedQuestion } from '../../../data/types/content/faq';
import { v4 as uuidv4 } from 'uuid';



const state = new ServerState<{
    questions: FrequentlyAskedQuestion[]
}>('content:faq', {
    questions: [
        {
            id: uuidv4(),
            question: `What is a hackathon?`,
            answer: '[answer]'
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


const procedures = t.router({
    list: t.procedure
        .query(async () => {
            const questions = await state.get('questions');
            return { questions }
        }),
    
    /** Inserts a FAQ entry */
    insert: t.procedure
        .use(access({ content: { update: true } }))
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
    update: t.procedure
        // .use(access({ content: { update: true } }))
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
    arrange: t.procedure
        // .use(access({ content: { update: true } }))
        .input(z.object({
            /** A list of IDs in the desired order */
            order: z.array(z.string())
        }))
        .mutation(async ({ input }) => {

        }),

    /** Deletes a FAQ entry */
    remove: t.procedure
        // .use(access({ content: { update: true } }))
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {

        }),
})

export default procedures;

// procedures.createCaller({} as any).arrange({ order: ['123', '456'] })