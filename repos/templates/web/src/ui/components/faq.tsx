import { api } from '@kenthackenough/ui/trpc';
import { Accordion, AccordionProps } from '@mantine/core';
export { FrequentlyAskedQuestions } from '@kenthackenough/ui/faq';

// export function FrequentlyAskedQuestions(props: Omit<AccordionProps, 'children'>) {
//     const query = api.content.faq.list.useQuery();
//     return <Accordion {...props}>
//         {(query.data?.questions || []).map(({ id, answer, question }) => <Accordion.Item value={id} key={id}>
//             <Accordion.Control>{question}</Accordion.Control>
//             <Accordion.Panel>{answer}</Accordion.Panel>
//         </Accordion.Item>)}
//     </Accordion>
// }