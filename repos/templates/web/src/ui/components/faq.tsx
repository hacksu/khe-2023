import { Accordion, AccordionProps } from '@mantine/core';


const QUESTIONS = [
    {
        id: 'dajshdgad',
        question: 'hi there',
        answer: `yeyeyeyeeee`
    },
    {
        id: 'asdfsafd',
        question: 'another question',
        answer: `woah`
    },
    {
        id: 'hgfdhdf',
        question: 'hmmm',
        answer: `omg`
    },
] as const;

export function FrequentlyAskedQuestions(props: Omit<AccordionProps, 'children'>) {
    return <Accordion {...props}>
        {QUESTIONS.map(({ id, answer, question }) => <Accordion.Item value={id} key={id}>
            <Accordion.Control>{question}</Accordion.Control>
            <Accordion.Panel>{answer}</Accordion.Panel>
        </Accordion.Item>)}
    </Accordion>
}