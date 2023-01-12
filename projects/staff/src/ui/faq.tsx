import { ReactMarkdownCompiler } from '@kenthackenough/mdx/compile';
import { Accordion, AccordionProps, Button } from '@mantine/core';
import { useFAQ } from '@kenthackenough/ui/faq';
import * as runtime from 'react/jsx-runtime';

const mdx = new ReactMarkdownCompiler({
    runtime,
    components: {
        Button,
    },
})

export function FrequentlyAskedQuestions(props: Omit<AccordionProps, 'children'>) {
    const questions = useFAQ(mdx);
    return <Accordion {...props}>
        {questions.map(({ id, answer, question, component }) => <Accordion.Item value={id} key={id}>
            <Accordion.Control>{question}</Accordion.Control>
            <Accordion.Panel>{component}</Accordion.Panel>
        </Accordion.Item>)}
    </Accordion>
}
