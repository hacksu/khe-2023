import { Accordion, AccordionProps } from '@mantine/core';
import { api } from '../utils/trpc';

/** @export 'faq' */

export function useFAQ() {
    const query = api.content.faq.list.useQuery();
    const questions = query.data?.questions || [];
    
}

export function FrequentlyAskedQuestions(props: Omit<AccordionProps, 'children'>) {
    const query = api.content.faq.list.useQuery();
    return <Accordion {...props}>
        {(query.data?.questions || []).map(({ id, answer, question }) => <Accordion.Item value={id} key={id}>
            <Accordion.Control>{question}</Accordion.Control>
            <Accordion.Panel>{answer}</Accordion.Panel>
        </Accordion.Item>)}
    </Accordion>
}