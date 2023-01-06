import { Accordion, AccordionProps } from '@mantine/core';
import { ReactMarkdownRenderer } from '@kenthackenough/mdx';
import { Button } from '@mantine/core';
import { api } from '../utils/trpc';
import { useEffect, useMemo, useState } from 'react';
import type { FrequentlyAskedQuestion } from '@kenthackenough/server/data';

/** @export 'faq' */



const mdx = new ReactMarkdownRenderer({
    components: {
        Button,
    },
    styles: []
})


async function compileQuestions(questions: FrequentlyAskedQuestion[]) {
    const renders = await Promise.all(questions.map(o => {
        return mdx.compile(o.answer)
    }));
    console.log({ renders })
    return questions.map((o, i) => {
        return Object.assign({ ...o, }, {
            component: renders[i]
        })
    });
}

export function useFAQ() {
    const query = api.content.faq.list.useQuery();
    const questions = query.data?.questions || [];
    const [compiled, setCompiled] = useState<(FrequentlyAskedQuestion & {
        component?: JSX.Element | string
    })[]>(questions.map(o => Object.assign(o, { component: o.answer })));
    useEffect(() => {
        compileQuestions(questions).then(o => {
            console.log('yaaay compile', o);
            setCompiled(o);
        });
    }, [questions]);
    console.log({ compiled })
    return compiled;
}

export function FrequentlyAskedQuestions(props: Omit<AccordionProps, 'children'>) {
    // const query = api.content.faq.list.useQuery();
    const questions = useFAQ();
    return <Accordion {...props}>
        {questions.map(({ id, answer, question, component }) => <Accordion.Item value={id} key={id}>
            <Accordion.Control>{question}</Accordion.Control>
            <Accordion.Panel>{component}</Accordion.Panel>
        </Accordion.Item>)}
    </Accordion>
}