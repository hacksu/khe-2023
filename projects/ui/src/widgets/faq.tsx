// import { Accordion, AccordionProps, Button } from '@mantine/core';
import type { ReactMarkdownCompiler } from '@kenthackenough/mdx/compile';
import { api } from '../utils/trpc';
import { useEffect, useMemo, useState } from 'react';
import type { FrequentlyAskedQuestion } from '@kenthackenough/server/data';
// import * as runtime from 'react/jsx-runtime';

/** @export 'faq' */


async function compileQuestions(mdx: ReactMarkdownCompiler | null, questions: FrequentlyAskedQuestion[]) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const renders = !mdx ? questions.map(o => {
        return 'loading...'
    }) : await Promise.all(questions.map(o => {
        return mdx.compile(o.answer)
    }));
    console.log({ renders })
    return questions.map((o, i) => {
        return Object.assign({ ...o, }, {
            component: renders[i]
        })
    });
}

// async function compileQuestions(mdx: ReactMarkdownCompiler, questions: FrequentlyAskedQuestion[]) {
//     const renders = await Promise.all(questions.map(o => {
//         return mdx.compile(o.answer)
//     }));
//     console.log({ renders })
//     return questions.map((o, i) => {
//         return Object.assign({ ...o, }, {
//             component: renders[i]
//         })
//     });
// }

export function useFAQ(mdx: ReactMarkdownCompiler | null) {
    const query = api.content.faq.list.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });
    const questions = query.data?.questions || [];
    const [compiled, setCompiled] = useState<(FrequentlyAskedQuestion & {
        component?: JSX.Element | string
    })[]>(questions.map(o => Object.assign(o, { component: o.answer })));
    useEffect(() => {
        compileQuestions(mdx, questions).then(o => {
            // console.log('yaaay compile', o);
            setCompiled(o);
        });
    }, [questions, mdx !== null]);
    // console.log({ compiled })
    return compiled;
}

// export function FrequentlyAskedQuestions(props: Omit<AccordionProps, 'children'>) {
//     // const query = api.content.faq.list.useQuery();
//     const questions = useFAQ();
//     return <Accordion {...props}>
//         {questions.map(({ id, answer, question, component }) => <Accordion.Item value={id} key={id}>
//             <Accordion.Control>{question}</Accordion.Control>
//             <Accordion.Panel>{component}</Accordion.Panel>
//         </Accordion.Item>)}
//     </Accordion>
// }