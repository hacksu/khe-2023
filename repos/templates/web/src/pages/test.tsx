import { Button } from '@mantine/core';
import { ReactMarkdownRenderer } from '@kenthackenough/mdx/render';
import * as runtime from 'react/jsx-runtime';
import { useEffect, useState } from 'react';

const mdx = new ReactMarkdownRenderer({
    runtime, // JSX Runtime
    styles: [
        `.red { color: red } .blue { color: blue }`,
        // `.blue { color: blue }`,
        `body { border: 1px solid black; }`
    ],
    components: {
        Button,
    }
})


export default function Heya() {
    const [a, setA] = useState('');
    useEffect(() => {
        mdx.render(`

# Hi there!

<span class="blue">yeyeye!</span>

<Button class="red">click me!</Button>

`).then(o => setA(o));
    }, []);
    return <div>
        <pre>
            {a}
        </pre>
        <iframe src={`data:text/html;base64,${btoa(a)}`} style={{ border: 0 }} />
    </div>
}
