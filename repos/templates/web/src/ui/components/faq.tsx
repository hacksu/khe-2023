import type { ReactMarkdownCompiler } from '@kenthackenough/mdx/compile';
import { Accordion, AccordionProps, Button } from '@mantine/core';
import { useFAQ } from '@kenthackenough/ui/faq';
import { useEffect, useState } from 'react';



export function FrequentlyAskedQuestions(props: Omit<AccordionProps, 'children'>) {
    const [mdx, setMdx] = useState<ReactMarkdownCompiler | null>(null);
    useEffect(() => {
        (async () => {
            const [{ default: runtime }, { ReactMarkdownCompiler }] = await Promise.all([
                import('react/jsx-runtime'),
                import('@kenthackenough/mdx/compile'),
            ])

            const mdx = new ReactMarkdownCompiler({
                runtime,
                components: {
                    Button,
                },
            })

            setMdx(mdx);

        })();
    }, [])
    const questions = useFAQ(mdx);
    return <Accordion {...props}>
        {questions.map(({ id, answer, question, component }) => <Accordion.Item value={id} key={id}>
            <Accordion.Control>{question}</Accordion.Control>
            <Accordion.Panel>{component}</Accordion.Panel>
        </Accordion.Item>)}
    </Accordion>
}

export default FrequentlyAskedQuestions;
